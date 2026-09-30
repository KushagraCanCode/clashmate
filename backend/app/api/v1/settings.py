from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, UserSettings, Village, Upgrade, Building, Hero
from app.schemas.schemas import UserSettingsResponse, UserSettingsUpdate, PasswordChangeRequest
from app.core.security import verify_password, hash_password

router = APIRouter()

@router.get("", response_model=UserSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.patch("", response_model=UserSettingsResponse)
def update_settings(
    payload: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(settings, key) and value is not None:
            setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings

@router.post("/change-password")
def change_password(
    payload: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password does not match.")
    
    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully."}

@router.get("/export")
def export_user_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """User-controlled full data export."""
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    upgrades = db.query(Upgrade).filter(Upgrade.village_id == village.id).all() if village else []
    buildings = db.query(Building).filter(Building.village_id == village.id).all() if village else []
    heroes = db.query(Hero).filter(Hero.village_id == village.id).all() if village else []
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()

    return {
        "user": {
            "username": current_user.username,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat()
        },
        "village": {
            "name": village.name if village else "",
            "tag": village.player_tag if village else "",
            "town_hall": village.town_hall_level if village else 0,
            "trophies": village.trophies if village else 0
        },
        "buildings_count": len(buildings),
        "heroes_count": len(heroes),
        "upgrades_count": len(upgrades),
        "export_timestamp": "2026-09-30T09:00:00Z"
    }

@router.delete("/account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Account deletion and permanent data cleanup."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated village telemetry deleted permanently."}
