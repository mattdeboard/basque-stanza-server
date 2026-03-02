FROM ghcr.io/astral-sh/uv:python3.10-bookworm-slim

WORKDIR /app

# Install dependencies first (separate layer for cache efficiency)
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Copy source and install the local package
COPY README.md .
COPY src/ src/
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

# Bake in Stanza models — the server uses DownloadMethod.REUSE_RESOURCES
# and will error on startup if models are missing.
RUN python -c "\
import stanza; \
stanza.download('eu', processors='tokenize,pos,lemma'); \
stanza.download('en', processors='tokenize,pos,lemma'); \
stanza.download('es', processors='tokenize,pos,lemma'); \
stanza.download('fr', processors='tokenize,pos,lemma')"

EXPOSE 8000

CMD ["python", "-m", "itzuli_nlp.alignment_server.server"]
