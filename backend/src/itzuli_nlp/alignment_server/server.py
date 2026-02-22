"""FastAPI HTTP server for alignment data generation."""

import logging
import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ..core.types import AnalysisRow, LanguageCode
from ..tools.dual_analysis import analyze_both_texts
from .alignment_generator import create_enriched_alignment_data
from .cache import AlignmentCache
from .types import SentencePair

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Alignment Server",
    description="HTTP API for generating alignment scaffolds from dual language analysis",
    version="1.0.0",
)

# Initialize cache
cache = AlignmentCache()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    """Request model for dual analysis."""

    text: str
    source_lang: LanguageCode
    target_lang: LanguageCode
    sentence_id: str = "default"


class AnalysisResponse(BaseModel):
    """Response model for dual analysis."""

    source_text: str
    target_text: str
    source_lang: str
    target_lang: str
    source_analysis: List[AnalysisRow]
    target_analysis: List[AnalysisRow]


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.options("/analyze-and-scaffold")
async def options_analyze_and_scaffold():
    """Handle preflight OPTIONS request for analyze-and-scaffold endpoint."""
    return {"message": "OK"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_texts(request: AnalysisRequest):
    """
    Perform dual analysis on source text and its translation.

    Returns analysis data for both source and target languages.
    """
    api_key = os.environ.get("ITZULI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ITZULI_API_KEY not configured")

    try:
        translated_text, source_analysis, target_analysis = analyze_both_texts(
            api_key=api_key, text=request.text, source_language=request.source_lang, target_language=request.target_lang
        )

        return AnalysisResponse(
            source_text=request.text,
            target_text=translated_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            source_analysis=source_analysis,
            target_analysis=target_analysis,
        )

    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyze-and-scaffold", response_model=SentencePair)
async def analyze_and_scaffold(request: AnalysisRequest):
    """
    Combined endpoint: analyze both texts, generate scaffold, and enrich with Claude-generated alignments.
    """
    itzuli_api_key = os.environ.get("ITZULI_API_KEY")
    if not itzuli_api_key:
        raise HTTPException(status_code=500, detail="ITZULI_API_KEY not configured")

    claude_api_key = os.environ.get("CLAUDE_API_KEY")
    if not claude_api_key:
        raise HTTPException(status_code=500, detail="CLAUDE_API_KEY not configured")

    # Check cache first
    cached_data = cache.get(request.text, request.source_lang, request.target_lang)
    if cached_data:
        logger.info(f"Cache hit for text: {request.text[:50]}...")
        return cached_data.sentences[0]

    try:
        # Perform dual analysis
        translated_text, source_analysis, target_analysis = analyze_both_texts(
            api_key=itzuli_api_key,
            text=request.text,
            source_language=request.source_lang,
            target_language=request.target_lang,
        )

        # Generate enriched alignment data with Claude
        alignment_data = create_enriched_alignment_data(
            source_analysis=source_analysis,
            target_analysis=target_analysis,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            source_text=request.text,
            target_text=translated_text,
            sentence_id=request.sentence_id,
            claude_api_key=claude_api_key,
        )

        # Cache the result
        cache.set(request.text, request.source_lang, request.target_lang, alignment_data)

        return alignment_data.sentences[0]

    except Exception as e:
        logger.error(f"Analysis and alignment generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis and alignment generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")

    logger.info(f"Starting alignment server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
