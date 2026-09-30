from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village, Builder
from app.schemas.schemas import BuilderResponse
from app.services.village_service import seed_default_village

router = APIRouter()

@router.get("", response_model=List[BuilderResponse])
def get_builders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    return db.query(Builder).filter(Builder.village_id == village.id).order_by(Builder.builder_index.asc()).all()
