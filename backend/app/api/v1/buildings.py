from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village, Building
from app.schemas.schemas import BuildingResponse
from app.services.village_service import seed_default_village

router = APIRouter()

@router.get("", response_model=List[BuildingResponse])
def get_buildings(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    query = db.query(Building).filter(Building.village_id == village.id)
    if category and category.lower() != "all":
        query = query.filter(Building.category == category.lower())
    if search:
        query = query.filter(Building.name.ilike(f"%{search}%"))

    return query.order_by(Building.category.asc(), Building.level.desc()).all()
