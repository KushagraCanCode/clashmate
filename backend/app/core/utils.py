import datetime

def utcnow() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)

def ensure_tz(dt: datetime.datetime) -> datetime.datetime:
    """Ensure datetime is offset-aware in UTC."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=datetime.timezone.utc)
    return dt
