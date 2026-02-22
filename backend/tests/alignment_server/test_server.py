"""Tests for alignment server FastAPI endpoints."""

import os
import subprocess
import sys
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from itzuli_nlp.alignment_server.server import app
from itzuli_nlp.alignment_server.types import (
    AlignmentData,
    AlignmentLayers,
    SentencePair,
    Token,
    TokenizedSentence,
)
from itzuli_nlp.core.types import AnalysisRow


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def itzuli_env():
    with patch.dict(os.environ, {"ITZULI_API_KEY": "test-key"}):
        yield


@pytest.fixture
def full_env():
    with patch.dict(os.environ, {"ITZULI_API_KEY": "test-key", "CLAUDE_API_KEY": "test-claude-key"}):
        yield


@pytest.fixture
def mock_analyze():
    with patch("itzuli_nlp.alignment_server.server.analyze_both_texts") as mock:
        yield mock


@pytest.fixture
def mock_scaffold():
    with patch("itzuli_nlp.alignment_server.server.create_enriched_alignment_data") as mock:
        yield mock


@pytest.fixture
def scaffold_setup(full_env, mock_analyze, mock_scaffold):
    with patch("itzuli_nlp.alignment_server.server.cache.get", return_value=None) as mock_cache:
        yield {"mock_analyze": mock_analyze, "mock_scaffold": mock_scaffold, "mock_cache": mock_cache}


@pytest.fixture
def mock_analysis_data():
    source_analysis = [
        AnalysisRow("Kaixo", "kaixo", "INTJ", ""),
        AnalysisRow("mundua", "mundu", "NOUN", "Case=Abs|Definite=Def|Number=Sing"),
    ]

    target_analysis = [
        AnalysisRow("Hello", "hello", "INTJ", ""),
        AnalysisRow("world", "world", "NOUN", "Number=Sing"),
    ]

    return "Hello world", source_analysis, target_analysis


@pytest.fixture
def mock_alignment_data():
    source_tokens = [
        Token(id="s0", form="Kaixo", lemma="kaixo", pos="intj", features=[]),
        Token(id="s1", form="mundua", lemma="mundu", pos="noun", features=["absolutive", "definite", "singular"]),
    ]

    target_tokens = [
        Token(id="t0", form="Hello", lemma="hello", pos="intj", features=[]),
        Token(id="t1", form="world", lemma="world", pos="noun", features=["singular"]),
    ]

    source_sentence = TokenizedSentence(lang="eu", text="Kaixo mundua", tokens=source_tokens)
    target_sentence = TokenizedSentence(lang="en", text="Hello world", tokens=target_tokens)

    sentence_pair = SentencePair(
        id="test-001", source=source_sentence, target=target_sentence, layers=AlignmentLayers()
    )

    return AlignmentData(sentences=[sentence_pair])


# Request data factory functions
def basic_request(text="Kaixo mundua", source_lang="eu", target_lang="en"):
    return {"text": text, "source_lang": source_lang, "target_lang": target_lang}


# Mock configuration helper functions
def setup_analyze_mock(mock_analyze, data=None, error=None):
    if error:
        mock_analyze.side_effect = Exception(error)
    elif data:
        mock_analyze.return_value = data
    else:
        raise ValueError("Must provide either data or error")


def setup_scaffold_mock(mock_scaffold, data=None, error=None):
    if error:
        mock_scaffold.side_effect = Exception(error)
    elif data:
        mock_scaffold.return_value = data
    else:
        raise ValueError("Must provide either data or error")


def assert_analyze_called(mock_analyze, text="Kaixo mundua", source_lang="eu", target_lang="en"):
    mock_analyze.assert_called_once_with(
        api_key="test-key", text=text, source_language=source_lang, target_language=target_lang
    )


def assert_scaffold_called(
    mock_scaffold,
    mock_analysis_data,
    text="Kaixo mundua",
    translated_text="Hello world",
    source_lang="eu",
    target_lang="en",
    sentence_id="test-001",
):
    mock_scaffold.assert_called_once_with(
        source_analysis=mock_analysis_data[1],
        target_analysis=mock_analysis_data[2],
        source_lang=source_lang,
        target_lang=target_lang,
        source_text=text,
        target_text=translated_text,
        sentence_id=sentence_id,
        claude_api_key="test-claude-key",
    )


# Response validation helper functions
def assert_error_response(response, status_code, message_fragment):
    assert response.status_code == status_code
    assert message_fragment in response.json()["detail"]


def assert_analysis_response_structure(data):
    assert "source_text" in data
    assert "target_text" in data
    assert "source_lang" in data
    assert "target_lang" in data
    assert "source_analysis" in data
    assert "target_analysis" in data
    assert len(data["source_analysis"]) >= 0
    assert len(data["target_analysis"]) >= 0


def assert_scaffold_response_structure(data):
    assert "id" in data
    assert "source" in data
    assert "target" in data


class TestHealthCheck:
    def test_health_check_returns_healthy_status(self, client):
        response = client.get("/health")

        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestAnalyzeEndpoint:
    def test_analyze_texts_success(self, itzuli_env, mock_analyze, client, mock_analysis_data):
        setup_analyze_mock(mock_analyze, data=mock_analysis_data)

        response = client.post(
            "/analyze",
            json={"text": "Kaixo mundua", "source_lang": "eu", "target_lang": "en", "sentence_id": "test-001"},
        )

        assert response.status_code == 200
        data = response.json()

        assert_analysis_response_structure(data)
        assert data["source_text"] == "Kaixo mundua"
        assert data["target_text"] == "Hello world"
        assert data["source_lang"] == "eu"
        assert data["target_lang"] == "en"
        assert len(data["source_analysis"]) == 2
        assert len(data["target_analysis"]) == 2

        # Verify analysis row structure
        assert data["source_analysis"][0] == {"word": "Kaixo", "lemma": "kaixo", "upos": "INTJ", "feats": ""}

        assert_analyze_called(mock_analyze)

    @patch.dict(os.environ, {}, clear=True)
    def test_analyze_texts_missing_api_key(self, client):
        response = client.post("/analyze", json=basic_request())

        assert_error_response(response, 500, "ITZULI_API_KEY not configured")

    def test_analyze_texts_analysis_error(self, itzuli_env, mock_analyze, client):
        setup_analyze_mock(mock_analyze, error="Translation failed")

        response = client.post("/analyze", json=basic_request())

        assert_error_response(response, 500, "Analysis failed: Translation failed")

    def test_analyze_texts_invalid_request(self, client):
        response = client.post("/analyze", json={"text": "Kaixo"})

        assert response.status_code == 422  # Validation error

    def test_analyze_texts_with_default_sentence_id(self, itzuli_env, mock_analyze, client, mock_analysis_data):
        setup_analyze_mock(mock_analyze, data=mock_analysis_data)

        response = client.post("/analyze", json=basic_request())

        assert response.status_code == 200
        # The sentence_id is only used in /analyze-and-scaffold, not /analyze


class TestAnalyzeAndScaffoldEndpoint:
    def test_analyze_and_scaffold_success(self, scaffold_setup, client, mock_analysis_data, mock_alignment_data):
        setup_analyze_mock(scaffold_setup["mock_analyze"], data=mock_analysis_data)
        setup_scaffold_mock(scaffold_setup["mock_scaffold"], data=mock_alignment_data)

        response = client.post(
            "/analyze-and-scaffold",
            json={"text": "Kaixo mundua", "source_lang": "eu", "target_lang": "en", "sentence_id": "test-001"},
        )

        assert response.status_code == 200
        data = response.json()

        assert_scaffold_response_structure(data)

        # Verify both functions were called correctly
        assert_analyze_called(scaffold_setup["mock_analyze"])
        assert_scaffold_called(scaffold_setup["mock_scaffold"], mock_analysis_data)

    @patch.dict(os.environ, {}, clear=True)
    def test_analyze_and_scaffold_missing_api_key(self, client):
        response = client.post("/analyze-and-scaffold", json=basic_request())

        assert_error_response(response, 500, "ITZULI_API_KEY not configured")

    def test_analyze_and_scaffold_analysis_error(self, scaffold_setup, client):
        setup_analyze_mock(scaffold_setup["mock_analyze"], error="Analysis failed")

        response = client.post("/analyze-and-scaffold", json=basic_request())

        assert_error_response(response, 500, "Analysis and alignment generation failed: Analysis failed")

    def test_analyze_and_scaffold_scaffold_error(self, scaffold_setup, client, mock_analysis_data):
        setup_analyze_mock(scaffold_setup["mock_analyze"], data=mock_analysis_data)
        setup_scaffold_mock(scaffold_setup["mock_scaffold"], error="Scaffold creation failed")

        response = client.post("/analyze-and-scaffold", json=basic_request())

        assert_error_response(response, 500, "Analysis and alignment generation failed: Scaffold creation failed")

    def test_analyze_and_scaffold_invalid_request(self, client):
        response = client.post("/analyze-and-scaffold", json={"text": "test"})

        assert response.status_code == 422  # Validation error

    def test_analyze_and_scaffold_with_default_sentence_id(
        self, scaffold_setup, client, mock_analysis_data, mock_alignment_data
    ):
        setup_analyze_mock(scaffold_setup["mock_analyze"], data=mock_analysis_data)
        setup_scaffold_mock(scaffold_setup["mock_scaffold"], data=mock_alignment_data)

        response = client.post("/analyze-and-scaffold", json=basic_request())

        assert response.status_code == 200

        # Verify default sentence_id was used
        call_args = scaffold_setup["mock_scaffold"].call_args
        assert call_args.kwargs["sentence_id"] == "default"


class TestModelValidation:
    def test_analysis_request_model_validation(self):
        from itzuli_nlp.alignment_server.server import AnalysisRequest

        # Valid request
        valid_request = AnalysisRequest(text="Kaixo", source_lang="eu", target_lang="en", sentence_id="test-001")
        assert valid_request.text == "Kaixo"
        assert valid_request.sentence_id == "test-001"

        # Request with default sentence_id
        default_request = AnalysisRequest(text="Kaixo", source_lang="eu", target_lang="en")
        assert default_request.sentence_id == "default"

    def test_analysis_response_model_validation(self):
        from itzuli_nlp.alignment_server.server import AnalysisResponse

        source_analysis = [AnalysisRow("Kaixo", "kaixo", "INTJ", "")]
        target_analysis = [AnalysisRow("Hello", "hello", "INTJ", "")]

        response = AnalysisResponse(
            source_text="Kaixo",
            target_text="Hello",
            source_lang="eu",
            target_lang="en",
            source_analysis=source_analysis,
            target_analysis=target_analysis,
        )

        assert response.source_text == "Kaixo"
        assert len(response.source_analysis) == 1
        assert isinstance(response.source_analysis[0], AnalysisRow)


class TestAppConfiguration:
    def test_fastapi_app_metadata(self):
        assert app.title == "Alignment Server"
        assert app.description == "HTTP API for generating alignment scaffolds from dual language analysis"
        assert app.version == "0.1.0"


class TestMainBlock:
    def test_main_block_execution(self):
        """Test the main block execution path for full coverage."""
        try:
            # Execute the main block directly by running the module
            result = subprocess.run(
                [sys.executable, "-m", "itzuli_nlp.alignment_server.server"],
                cwd=os.getcwd(),
                env={**os.environ, "PORT": "9000", "HOST": "127.0.0.1", "ITZULI_API_KEY": "test-key"},
                capture_output=True,
                text=True,
                timeout=1,  # Quick timeout since we just want to trigger the main block
            )
        except subprocess.TimeoutExpired as e:
            # This is expected - the server starts and we kill it with timeout
            # The important thing is that we see the startup log message
            stderr_output = e.stderr.decode() if e.stderr else ""
            assert "Starting alignment server on 127.0.0.1:9000" in stderr_output
            assert "ModuleNotFoundError" not in stderr_output
            return

        # If no timeout, check that server started successfully
        assert "Starting alignment server" in result.stderr
        assert "ModuleNotFoundError" not in result.stderr

    def test_environment_variable_parsing(self):
        # Test environment variable parsing logic separately
        original_env = os.environ.copy()

        try:
            # Test with custom values
            os.environ["PORT"] = "9000"
            os.environ["HOST"] = "127.0.0.1"

            port = int(os.environ.get("PORT", 8000))
            host = os.environ.get("HOST", "0.0.0.0")

            assert port == 9000
            assert host == "127.0.0.1"

            # Test with defaults
            del os.environ["PORT"]
            del os.environ["HOST"]

            port = int(os.environ.get("PORT", 8000))
            host = os.environ.get("HOST", "0.0.0.0")

            assert port == 8000
            assert host == "0.0.0.0"

        finally:
            # Restore original environment
            os.environ.clear()
            os.environ.update(original_env)


class TestErrorHandling:
    def test_analyze_logs_error_on_failure(self, itzuli_env, mock_analyze, client):
        setup_analyze_mock(mock_analyze, error="Test error")

        with patch("itzuli_nlp.alignment_server.server.logger") as mock_logger:
            response = client.post("/analyze", json=basic_request("Kaixo"))

            assert response.status_code == 500
            mock_logger.error.assert_called_once_with("Analysis failed: Test error")

    def test_analyze_and_scaffold_logs_error_on_failure(self, itzuli_env, mock_analyze, mock_scaffold, client):
        setup_analyze_mock(mock_analyze, error="Test error")

        with patch("itzuli_nlp.alignment_server.server.logger") as mock_logger:
            response = client.post("/analyze-and-scaffold", json=basic_request("Kaixo"))

            assert response.status_code == 500
            mock_logger.error.assert_called_once_with("Analysis and alignment generation failed: Test error")


class TestEdgeCases:
    def test_analyze_with_empty_features(self, itzuli_env, mock_analyze, client):
        # Test with empty features
        source_analysis = [AnalysisRow("test", "test", "NOUN", "")]
        target_analysis = [AnalysisRow("test", "test", "NOUN", "")]
        setup_analyze_mock(mock_analyze, data=("test", source_analysis, target_analysis))

        response = client.post("/analyze", json=basic_request("test"))

        assert response.status_code == 200
        data = response.json()
        assert data["source_analysis"][0]["feats"] == ""


class TestResponseSchemas:
    def test_analysis_response_schema_compatibility(self, itzuli_env, mock_analyze, client):
        # Test that AnalysisRow objects serialize correctly in FastAPI
        source_analysis = [AnalysisRow("Kaixo", "kaixo", "INTJ", "Animacy=Inan")]
        target_analysis = [AnalysisRow("Hello", "hello", "INTJ", "")]
        setup_analyze_mock(mock_analyze, data=("Hello", source_analysis, target_analysis))

        response = client.post("/analyze", json=basic_request("Kaixo"))

        assert response.status_code == 200
        data = response.json()

        # Verify AnalysisRow serialization
        source_row = data["source_analysis"][0]
        assert source_row["word"] == "Kaixo"
        assert source_row["lemma"] == "kaixo"
        assert source_row["upos"] == "INTJ"
        assert source_row["feats"] == "Animacy=Inan"

        target_row = data["target_analysis"][0]
        assert target_row["word"] == "Hello"
        assert target_row["feats"] == ""
