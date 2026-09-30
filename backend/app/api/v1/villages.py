from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village
from app.schemas.schemas import VillageResponse, VillageCreate
from app.services.village_service import calculate_village_stats, seed_default_village

router = APIRouter()

@router.get("", response_model=list[VillageResponse])
def get_user_villages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    villages = db.query(Village).filter(Village.user_id == current_user.id).all()
    if not villages:
        v = seed_default_village(db, current_user.id, current_user.full_name or current_user.username)
        return [v]
    return villages

@router.get("/active/summary")
def get_active_village_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.full_name or current_user.username)
    
    stats = calculate_village_stats(db, village)
    return {
        "village": {
            "id": village.id,
            "name": village.name,
            "player_tag": village.player_tag,
            "town_hall": village.town_hall_level,
            "clan_name": village.clan_name,
            "trophies": village.trophies,
            "war_stars": village.war_stars
        },
        "stats": stats
    }

@router.post("", response_model=VillageResponse)
def create_village(
    payload: VillageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = seed_default_village(
        db,
        user_id=current_user.id,
        player_name=payload.name,
        player_tag=payload.player_tag
    )
    village.town_hall_level = payload.town_hall_level
    village.builder_count = payload.builder_count
    if payload.clan_name:
        village.clan_name = payload.clan_name
    db.commit()
    db.refresh(village)
    return village
