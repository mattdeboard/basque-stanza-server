"""IP-based daily rate limiter backed by SQLite."""

import datetime
import os

import aiosqlite

DB_PATH = os.getenv("RATE_LIMIT_DB", ".cache/rate_limits.db")
DAILY_LIMIT = int(os.getenv("DAILY_LIMIT", "10"))

_LOOPBACK = {"127.0.0.1", "::1", "localhost"}


async def check_and_increment(ip: str) -> tuple[bool, int]:
    """
    Check whether `ip` is under the daily limit and increment its count if so.

    Returns (allowed, remaining) where `remaining` is the number of requests
    left after this one (0 when the limit is exactly reached).

    Loopback addresses (127.0.0.1, ::1) are always allowed without counting,
    so local development is unaffected.
    """
    if ip in _LOOPBACK:
        return True, DAILY_LIMIT

    os.makedirs(os.path.dirname(os.path.abspath(DB_PATH)), exist_ok=True)
    day = datetime.date.today().isoformat()

    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "CREATE TABLE IF NOT EXISTS usage "
            "(ip TEXT, day TEXT, count INTEGER, PRIMARY KEY (ip, day))"
        )
        row = await (
            await db.execute("SELECT count FROM usage WHERE ip=? AND day=?", (ip, day))
        ).fetchone()
        count = row[0] if row else 0

        if count >= DAILY_LIMIT:
            return False, 0

        await db.execute(
            "INSERT INTO usage (ip, day, count) VALUES (?,?,1) "
            "ON CONFLICT(ip, day) DO UPDATE SET count=count+1",
            (ip, day),
        )
        await db.commit()
        return True, DAILY_LIMIT - count - 1
