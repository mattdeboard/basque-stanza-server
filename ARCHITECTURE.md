# Architecture Documentation

This document provides a comprehensive overview of the itzuli-stanza-mcp project architecture.

## Project Overview

A dual-service system combining Basque morphological analysis via Stanford's Stanza library with Basque translation capabilities through the Itzuli API. The project provides both a Flask HTTP server and an MCP (Model Context Protocol) server for different integration scenarios.

## Project Structure

```code
itzuli_stanza_mcp/
├── app.py                 # Flask HTTP server for Stanza morphological analysis
├── itzuli_mcp_server.py   # MCP server for Itzuli translation services
├── nlp.py                 # Stanza pipeline configuration and text processing logic
└── __init__.py
tests/
├── test_itzuli_mcp_server.py
└── __init__.py
pyproject.toml             # Project dependencies and configuration
README.md                  # User documentation
CLAUDE.md                  # Development guidelines
```

## Core Components

### 1. Stanza Analysis Service (`app.py`)

- **Technology**: Flask web framework
- **Purpose**: HTTP API for Basque morphological analysis
- **Port**: 5001
- **Endpoint**: `POST /stanza`
- **Dependencies**: `nlp.py` for processing pipeline

### 2. Itzuli Translation Service (`itzuli_mcp_server.py`)

- **Technology**: MCP (Model Context Protocol) server with FastMCP
- **Purpose**: Translation tools for AI assistants
- **Transport**: stdio
- **Authentication**: Requires `ITZULI_API_KEY` environment variable

### 3. NLP Processing Module (`nlp.py`)

- **Technology**: Stanford Stanza library
- **Purpose**: Basque language processing and feature extraction
- **Pipeline**: tokenize, POS tagging, lemmatization
- **Features**: Friendly feature mapping for linguistic annotations

## High-Level System Diagram

```code
┌─────────────────┐    ┌──────────────────┐
│   HTTP Client   │───▶│  Flask Server    │
│                 │    │  (port 5001)     │
└─────────────────┘    └──────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │   Stanza NLP     │
                       │   Pipeline       │
                       └──────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  MCP Client     │───▶│  MCP Server      │───▶│  Itzuli API      │
│  (AI Assistant) │    │  (stdio)         │    │  (External)      │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

## Data Flow

### Stanza Analysis Flow

1. Client sends POST request with Basque text
2. Flask server extracts text from JSON payload
3. Text processed through Stanza pipeline (tokenize → POS → lemma)
4. Linguistic features mapped to human-friendly descriptions
5. Results returned as JSON array of word analysis

### Itzuli Translation Flow

1. MCP client invokes translation tool
2. Server validates language pair (must include Basque)
3. Request sent to Itzuli API with authentication
4. Translation result returned as JSON

## External Integrations

### Itzuli API

- **Purpose**: Basque translation service
- **Authentication**: API key via environment variable
- **Supported Languages**: Basque ↔ Spanish, English, French
- **Endpoints Used**: Translation, quota checking, feedback submission

### Stanford Stanza

- **Purpose**: Basque morphological analysis
- **Model**: Pre-trained Basque language model
- **Download Strategy**: Reuse existing resources
- **Processors**: tokenize, pos, lemma

## Security Considerations

- API key stored in environment variables (not hardcoded)
- Input validation for supported language pairs
- Error handling prevents information leakage
- MCP server runs over stdio (no network exposure)

## Development Environment

### Dependencies

- **Core**: Flask, Stanza, Itzuli, MCP
- **Development**: pytest, ruff, anyio
- **Python Version**: ≥3.10

### Testing

- Test suite in `tests/` directory
- Focus on MCP server functionality
- Run with: `pytest`

### Code Quality

- Linting with ruff
- Type hints where applicable
- Logging configured via environment variables

## Deployment

### Stanza Server

```bash
uv run python -m itzuli_stanza_mcp.app
```

### MCP Server

```bash
ITZULI_API_KEY=your-key uv run python -m itzuli_stanza_mcp.itzuli_mcp_server
```

## Future Considerations

- Consider adding batch processing for multiple texts
- Potential caching layer for frequently analyzed text
- Additional language pairs if Itzuli API expands support
- WebSocket support for real-time analysis
- Authentication layer for Flask server if deployed publicly

## Glossary

- **MCP**: Model Context Protocol - standard for AI assistant tool integration
- **Stanza**: Stanford NLP library for multilingual text analysis
- **Itzuli**: Basque government's official translation API
- **Morphological Analysis**: Breaking down words into their grammatical components
- **Lemmatization**: Finding the base/dictionary form of words
