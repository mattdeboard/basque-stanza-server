"""Tests for IP-based daily rate limiter."""

import datetime
from unittest.mock import patch

import pytest

import itzuli_nlp.alignment_server.rate_limiter as rl_module
from itzuli_nlp.alignment_server.rate_limiter import check_and_increment


@pytest.fixture
def db_path(tmp_path):
    """Provide a temporary, isolated SQLite path for each test."""
    return str(tmp_path / "rate_limits.db")


@pytest.fixture(autouse=True)
def isolate_db(db_path):
    """Redirect the module's DB_PATH to a temp file for every test."""
    with patch.object(rl_module, "DB_PATH", db_path):
        yield


class TestHappyPath:
    @pytest.mark.anyio
    async def test_first_request_is_allowed(self):
        allowed, remaining = await check_and_increment("1.2.3.4")

        assert allowed is True
        assert remaining == 9  # 10 limit - 1 used = 9 left

    @pytest.mark.anyio
    async def test_remaining_decrements_with_each_call(self):
        for expected_remaining in [9, 8, 7]:
            _, remaining = await check_and_increment("1.2.3.4")
            assert remaining == expected_remaining

    @pytest.mark.anyio
    async def test_last_allowed_request_returns_zero_remaining(self):
        with patch.object(rl_module, "DAILY_LIMIT", 3):
            await check_and_increment("1.2.3.4")
            await check_and_increment("1.2.3.4")
            allowed, remaining = await check_and_increment("1.2.3.4")

        assert allowed is True
        assert remaining == 0

    @pytest.mark.anyio
    async def test_different_ips_have_independent_counts(self):
        allowed_a, _ = await check_and_increment("10.0.0.1")
        allowed_b, remaining_b = await check_and_increment("10.0.0.2")

        assert allowed_a is True
        assert allowed_b is True
        assert remaining_b == 9  # IP B still has full quota minus its one call


class TestRateLimited:
    @pytest.mark.anyio
    async def test_request_over_limit_is_denied(self):
        with patch.object(rl_module, "DAILY_LIMIT", 2):
            await check_and_increment("5.5.5.5")
            await check_and_increment("5.5.5.5")
            allowed, remaining = await check_and_increment("5.5.5.5")

        assert allowed is False
        assert remaining == 0

    @pytest.mark.anyio
    async def test_denied_request_does_not_increment_count(self):
        with patch.object(rl_module, "DAILY_LIMIT", 1):
            await check_and_increment("5.5.5.5")  # uses the quota
            await check_and_increment("5.5.5.5")  # denied — must not increment
            await check_and_increment("5.5.5.5")  # denied — must not increment

            # Now raise the limit: only 1 should have been recorded
            with patch.object(rl_module, "DAILY_LIMIT", 10):
                allowed, remaining = await check_and_increment("5.5.5.5")

        assert allowed is True
        assert remaining == 8  # 10 limit - 1 recorded - 1 just used = 8


class TestDayBoundary:
    @pytest.mark.anyio
    async def test_quota_resets_the_next_day(self):
        today = datetime.date(2026, 3, 1)
        tomorrow = datetime.date(2026, 3, 2)

        with patch.object(rl_module, "DAILY_LIMIT", 1):
            with patch("itzuli_nlp.alignment_server.rate_limiter.datetime") as mock_dt:
                mock_dt.date.today.return_value = today
                await check_and_increment("7.7.7.7")  # exhausts today's quota

                mock_dt.date.today.return_value = tomorrow
                allowed, remaining = await check_and_increment("7.7.7.7")

        assert allowed is True
        assert remaining == 0


class TestLocalDevBypass:
    @pytest.mark.anyio
    async def test_loopback_ipv4_always_allowed(self):
        with patch.object(rl_module, "DAILY_LIMIT", 0):  # limit of 0 would block everyone
            allowed, remaining = await check_and_increment("127.0.0.1")

        assert allowed is True
        assert remaining == 0  # DAILY_LIMIT value returned as-is

    @pytest.mark.anyio
    async def test_loopback_ipv6_always_allowed(self):
        with patch.object(rl_module, "DAILY_LIMIT", 0):
            allowed, _ = await check_and_increment("::1")

        assert allowed is True

    @pytest.mark.anyio
    async def test_loopback_does_not_touch_database(self, db_path):
        import os

        await check_and_increment("127.0.0.1")
        assert not os.path.exists(db_path)  # DB never created for loopback


class TestConfiguration:
    @pytest.mark.anyio
    async def test_custom_daily_limit_is_respected(self):
        with patch.object(rl_module, "DAILY_LIMIT", 3):
            _, r1 = await check_and_increment("9.9.9.9")
            _, r2 = await check_and_increment("9.9.9.9")
            _, r3 = await check_and_increment("9.9.9.9")
            allowed, r4 = await check_and_increment("9.9.9.9")

        assert r1 == 2
        assert r2 == 1
        assert r3 == 0
        assert allowed is False

    @pytest.mark.anyio
    async def test_db_file_is_created(self, db_path):
        import os

        assert not os.path.exists(db_path)
        await check_and_increment("1.1.1.1")
        assert os.path.exists(db_path)
