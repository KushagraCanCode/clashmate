import datetime
from datetime import timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.core.utils import ensure_tz, utcnow
from app.models.models import BusySession, Upgrade, Village, Notification, AnalyticsEvent

def get_active_busy_session(db: Session, user_id: int) -> Optional[BusySession]:
    """Return currently active busy mode session for user, if any."""
    session = db.query(BusySession).filter(
        BusySession.user_id == user_id,
        BusySession.is_active == True
    ).order_by(BusySession.id.desc()).first()

    if session:
        # Check if expired
        now = utcnow()
        if ensure_tz(session.end_time) <= now:
            session.is_active = False
            db.commit()
            return None
    return session

def start_busy_mode(
    db: Session,
    user_id: int,
    duration_label: str,
    duration_seconds: int,
    allow_critical_only: bool = True,
    notify_hero_finish: bool = True,
    notify_lab_finish: bool = True
) -> BusySession:
    """Start or update Busy Mode session for user."""
    # Deactivate existing active sessions
    existing = db.query(BusySession).filter(
        BusySession.user_id == user_id,
        BusySession.is_active == True
    ).all()
    for s in existing:
        s.is_active = False

    now = utcnow()
    end_time = now + timedelta(seconds=duration_seconds)

    # Find the next important event for the user's village
    village = db.query(Village).filter(Village.user_id == user_id).first()
    next_event_title = None
    next_event_time = None

    if village:
        next_upg = db.query(Upgrade).filter(
            Upgrade.village_id == village.id,
            Upgrade.status == "active"
        ).order_by(Upgrade.completes_at.asc()).first()
        if next_upg:
            next_event_title = f"{next_upg.target_name} (Lv {next_upg.to_level})"
            next_event_time = next_upg.completes_at

    session = BusySession(
        user_id=user_id,
        duration_label=duration_label,
        duration_seconds=duration_seconds,
        start_time=now,
        end_time=end_time,
        is_active=True,
        allow_critical_only=allow_critical_only,
        notify_hero_finish=notify_hero_finish,
        notify_lab_finish=notify_lab_finish,
        next_event_title=next_event_title,
        next_event_time=next_event_time
    )
    db.add(session)

    # Log analytics event
    event = AnalyticsEvent(
        user_id=user_id,
        village_id=village.id if village else None,
        event_type="busy_start",
        event_metadata={"duration": duration_label, "duration_seconds": duration_seconds}
    )
    db.add(event)

    # Dispatch confirmation notification
    hours_left = round(duration_seconds / 3600, 1)
    notif = Notification(
        user_id=user_id,
        type="busy_mode",
        title="Busy Mode Activated",
        message=f"You're protected for {duration_label} (~{hours_left}h). Non-critical alerts silenced.",
        link="/busy-mode",
        is_read=False,
        sent_at=now
    )
    db.add(notif)

    db.commit()
    db.refresh(session)
    return session

def end_busy_mode(db: Session, user_id: int) -> bool:
    """End active busy session early."""
    sessions = db.query(BusySession).filter(
        BusySession.user_id == user_id,
        BusySession.is_active == True
    ).all()
    for s in sessions:
        s.is_active = False
    db.commit()
    return True
