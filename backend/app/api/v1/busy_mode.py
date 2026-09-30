from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import BusyModeStartRequest, BusyModeResponse
from app.services.busy_service import start_busy_mode, get_active_busy_session, end_busy_mode

router = APIRouter()

@router.get("/status", response_model=BusyModeResponse)
def get_busy_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = get_active_busy_session(db, current_user.id)
    if not session:
        return {
            "id": None,
            "is_active": False,
            "duration_label": None,
            "start_time": None,
            "end_time": None,
            "allow_critical_only": True,
            "notify_hero_finish": True,
            "notify_lab_finish": True,
            "next_event_title": None,
            "next_event_time": None
        }

    return {
        "id": session.id,
        "is_active": session.is_active,
        "duration_label": session.duration_label,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "allow_critical_only": session.allow_critical_only,
        "notify_hero_finish": session.notify_hero_finish,
        "notify_lab_finish": session.notify_lab_finish,
        "next_event_title": session.next_event_title,
        "next_event_time": session.next_event_time
    }

@router.post("/start", response_model=BusyModeResponse)
def activate_busy_mode(
    payload: BusyModeStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = start_busy_mode(
        db=db,
        user_id=current_user.id,
        duration_label=payload.duration_label,
        duration_seconds=payload.duration_seconds,
        allow_critical_only=payload.allow_critical_only,
        notify_hero_finish=payload.notify_hero_finish,
        notify_lab_finish=payload.notify_lab_finish
    )
    return {
        "id": session.id,
        "is_active": True,
        "duration_label": session.duration_label,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "allow_critical_only": session.allow_critical_only,
        "notify_hero_finish": session.notify_hero_finish,
        "notify_lab_finish": session.notify_lab_finish,
        "next_event_title": session.next_event_title,
        "next_event_time": session.next_event_time
    }

@router.post("/end")
def deactivate_busy_mode(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    end_busy_mode(db, current_user.id)
    return {"message": "Busy mode deactivated successfully."}
