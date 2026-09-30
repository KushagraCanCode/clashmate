import datetime
from datetime import timezone
from workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.models import Upgrade, BusySession, Notification, UserSettings, Builder, Village
from app.services.notification_service import dispatch_notification

def utcnow():
    return datetime.datetime.now(timezone.utc)

@celery_app.task(name="check_upgrade_timers")
def check_upgrade_timers():
    """Worker job: Find completed upgrades, release builders, and dispatch notifications."""
    db = SessionLocal()
    now = utcnow()
    try:
        completed = db.query(Upgrade).filter(
            Upgrade.status == "active",
            Upgrade.completes_at <= now
        ).all()

        for u in completed:
            u.status = "completed"
            
            # Free builder
            if u.builder_index > 0:
                builder = db.query(Builder).filter(
                    Builder.village_id == u.village_id,
                    Builder.builder_index == u.builder_index
                ).first()
                if builder:
                    builder.status = "free"
                    builder.current_target_name = None
                    builder.finishes_at = None

            # Find user
            village = db.query(Village).filter(Village.id == u.village_id).first()
            if village:
                dispatch_notification(
                    db=db,
                    user_id=village.user_id,
                    event_type="upgrade",
                    title=f"Upgrade Completed: {u.target_name}",
                    message=f"{u.target_name} is now Level {u.to_level}! Builder #{u.builder_index} is free.",
                    link="/upgrades"
                )
        db.commit()
        return len(completed)
    finally:
        db.close()

@celery_app.task(name="process_busy_mode_expirations")
def process_busy_mode_expirations():
    """Worker job: Expire finished busy mode sessions and alert user."""
    db = SessionLocal()
    now = utcnow()
    try:
        expired = db.query(BusySession).filter(
            BusySession.is_active == True,
            BusySession.end_time <= now
        ).all()

        for s in expired:
            s.is_active = False
            dispatch_notification(
                db=db,
                user_id=s.user_id,
                event_type="busy_mode",
                title="Busy Mode Ended",
                message=f"Your {s.duration_label} Busy Mode session has concluded. Standard notifications resumed.",
                link="/busy-mode"
            )
        db.commit()
        return len(expired)
    finally:
        db.close()

@celery_app.task(name="send_daily_summary")
def send_daily_summary():
    """Worker job: Compile and send daily village digest."""
    db = SessionLocal()
    try:
        users = db.query(UserSettings).filter(UserSettings.daily_summary == True).all()
        for u_set in users:
            dispatch_notification(
                db=db,
                user_id=u_set.user_id,
                event_type="daily_summary",
                title="Village Daily Digest",
                message="Your daily upgrade overview is ready. Review active timers and builder availability.",
                link="/dashboard"
            )
        db.commit()
        return len(users)
    finally:
        db.close()
