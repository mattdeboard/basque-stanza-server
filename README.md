# itzuli-stanza-mcp

Basque morphological analysis via [Stanza](https://stanfordnlp.github.io/stanza/) and Basque translation via the [Itzuli](https://www.euskadi.eus/itzuli/) API, packaged as an MCP server.

## Project structure

```
itzuli_stanza_mcp/
  app.py                 # Flask server for Stanza morphological analysis
  nlp.py                 # Stanza pipeline and text processing
  itzuli_mcp_server.py   # MCP server for Itzuli translation
```

## Stanza server

```bash
uv run python -m itzuli_stanza_mcp.app
```

The server runs on port 5001.

### `POST /stanza`

```bash
curl -X POST http://localhost:5001/stanza \
  -H "Content-Type: application/json" \
  -d '{"text": "Ez ditut ezagutzen euskal abestiak"}'
```

Response:

```json
[
  {"word": "Ez", "lemma": "(ez)", "feats": "negation"},
  {"word": "ditut", "lemma": "(ukan)", "feats": "indicative mood, plural obj, singular sub, 3per obj (it/them), 1per sub (I), conjugated"},
  {"word": "ezagutzen", "lemma": "(ezagutu)", "feats": "habitual/ongoing"},
  {"word": "euskal", "lemma": "(euskal)", "feats": "combining prefix"},
  {"word": "abestiak", "lemma": "(abesti)", "feats": "absolutive (sub/obj), definite (the), plural"}
]
```

## MCP server (Itzuli)

Requires the `ITZULI_API_KEY` environment variable. Runs over stdio transport.

```bash
ITZULI_API_KEY=your-key uv run python -m itzuli_stanza_mcp.itzuli_mcp_server
```

### Tools

- **translate** — Translate text to or from Basque. Supported pairs: eu<->es, eu<->en, eu<->fr.
- **get_quota** — Check current API usage quota.
- **send_feedback** — Submit a correction or evaluation for a previous translation.
