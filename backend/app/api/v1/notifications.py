from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import NotificationResponse
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_read,
    mark_all_notifications_read,
    dispatch_notification
)

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_notifications(db, current_user.id)

@router.post("/read-all")
def read_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = mark_all_notifications_read(db, current_user.id)
    return {"marked_read": count}

@router.post("/{id}/read")
def read_single(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = mark_notification_read(db, id, current_user.id)
    return {"success": success}

@router.post("/test")
def trigger_test_notification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = dispatch_notification(
        db=db,
        user_id=current_user.id,
        event_type="system",
        title="🔔 Test Alert: Builder Notification",
        message="Your test alert channel is working perfectly! ClashMate is actively guarding your village.",
        link="/dashboard",
        is_critical=True
    )
    return {"message": "Test notification created.", "id": notif.id if notif else None}
