import datetime
from datetime import timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Notification, UserSettings, NotificationPreference

def utcnow():
    return datetime.datetime.now(timezone.utc)

def dispatch_notification(
    db: Session,
    user_id: int,
    event_type: str,  # upgrade, hero, lab, busy_mode, daily_summary, system
    title: str,
    message: str,
    link: str = "/dashboard",
    is_critical: bool = False
) -> Optional[Notification]:
    """Execute complete notification workflow respecting all user preferences and quiet hours."""
    # 1. Load user settings
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        # Fallback default notification
        notif = Notification(
            user_id=user_id,
            type=event_type,
            title=title,
            message=message,
            link=link,
            is_read=False,
            sent_at=utcnow()
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif

    # 2. Check whether event type is enabled
    type_enabled = True
    if event_type == "upgrade" and not settings.upgrade_alerts:
        type_enabled = False
    elif event_type == "hero" and not settings.hero_alerts:
        type_enabled = False
    elif event_type == "lab" and not settings.laboratory_alerts:
        type_enabled = False
    elif event_type == "daily_summary" and not settings.daily_summary:
        type_enabled = False

    if not type_enabled and not is_critical:
        return None

    # 3. Check quiet hours
    now_utc = utcnow()
    current_time_str = now_utc.strftime("%H:%M")
    if settings.quiet_hours_enabled:
        start_str = settings.quiet_hours_start
        end_str = settings.quiet_hours_end
        in_quiet_hours = False
        if start_str > end_str:  # e.g. 23:00 to 07:00 overnight
            in_quiet_hours = current_time_str >= start_str or current_time_str <= end_str
        else:
            in_quiet_hours = start_str <= current_time_str <= end_str

        if in_quiet_hours and settings.quiet_hours_critical_only and not is_critical:
            # Suppress non-critical notifications during quiet hours
            return None

    # 4. Create and store notification history
    notif = Notification(
        user_id=user_id,
        type=event_type,
        title=title,
        message=message,
        link=link,
        is_read=False,
        sent_at=now_utc
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

def get_user_notifications(db: Session, user_id: int, limit: int = 50) -> List[Notification]:
    """Return user notifications history ordered by newest first."""
    return db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.sent_at.desc()).limit(limit).all()

def mark_notification_read(db: Session, notification_id: int, user_id: int) -> bool:
    """Mark a single notification as read."""
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
        return True
    return False

def mark_all_notifications_read(db: Session, user_id: int) -> int:
    """Mark all unread notifications for a user as read."""
    updated = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({Notification.is_read: True})
    db.commit()
    return updated
