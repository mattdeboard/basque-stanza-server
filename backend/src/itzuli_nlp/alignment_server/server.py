"""FastAPI HTTP server for alignment data generation."""

import logging
import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ..core.types import AnalysisRow, LanguageCode
from tools.dual_analysis import analyze_both_texts
from .scaffold import create_scaffold_from_dual_analysis
from .types import AlignmentData, SentencePair

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Alignment Server",
    description="HTTP API for generating alignment scaffolds from dual language analysis",
    version="0.1.0"
)

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
            api_key=api_key,
            text=request.text,
            source_language=request.source_lang,
            target_language=request.target_lang
        )
        
        return AnalysisResponse(
            source_text=request.text,
            target_text=translated_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            source_analysis=source_analysis,
            target_analysis=target_analysis
        )
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")




@app.post("/analyze-and-scaffold", response_model=SentencePair)
async def analyze_and_scaffold(request: AnalysisRequest):
    """
    Combined endpoint: analyze both texts and generate scaffold in one call.
    """
    api_key = os.environ.get("ITZULI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ITZULI_API_KEY not configured")
    
    try:
        # First perform dual analysis
        translated_text, source_analysis, target_analysis = analyze_both_texts(
            api_key=api_key,
            text=request.text,
            source_language=request.source_lang,
            target_language=request.target_lang
        )
        
        # Then generate scaffold
        alignment_data = create_scaffold_from_dual_analysis(
            source_analysis=source_analysis,
            target_analysis=target_analysis,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            source_text=request.text,
            target_text=translated_text,
            sentence_id=request.sentence_id
        )
        
        # Return the first (and only) sentence pair
        return alignment_data.sentences[0]
        
    except Exception as e:
        logger.error(f"Analysis and scaffold generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis and scaffold generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    logger.info(f"Starting alignment server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)