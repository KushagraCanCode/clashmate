from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village, Upgrade
from app.schemas.schemas import UpgradeResponse, UpgradeCreate
from app.services.upgrade_service import get_village_upgrades, create_upgrade, complete_upgrade
from app.services.village_service import seed_default_village

router = APIRouter()

@router.get("", response_model=List[UpgradeResponse])
def list_upgrades(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    return get_village_upgrades(db, village.id, status)

@router.post("", response_model=UpgradeResponse)
def add_upgrade(
    payload: UpgradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    return create_upgrade(db, village.id, current_user.id, payload)

@router.get("/{id}", response_model=UpgradeResponse)
def get_upgrade(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upgrade = db.query(Upgrade).filter(Upgrade.id == id).first()
    if not upgrade:
        raise HTTPException(status_code=404, detail="Upgrade not found.")
    return upgrade

@router.post("/{id}/complete", response_model=UpgradeResponse)
def finish_upgrade(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upgrade = complete_upgrade(db, id, current_user.id)
    if not upgrade:
        raise HTTPException(status_code=400, detail="Cannot complete upgrade or upgrade not found.")
    return upgrade

@router.delete("/{id}")
def cancel_upgrade(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upgrade = db.query(Upgrade).filter(Upgrade.id == id).first()
    if not upgrade:
        raise HTTPException(status_code=404, detail="Upgrade not found.")
    upgrade.status = "cancelled"
    db.commit()
    return {"message": "Upgrade cancelled successfully."}
