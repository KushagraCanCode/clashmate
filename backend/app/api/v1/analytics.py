from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village
from app.services.analytics_service import get_analytics_overview
from app.services.village_service import seed_default_village

router = APIRouter()

@router.get("/overview")
def analytics_overview(
    range: str = Query("30d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    return get_analytics_overview(db, village.id, time_filter=range)

@router.get("/upgrades")
def analytics_upgrades(
    range: str = Query("30d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    data = get_analytics_overview(db, village.id, time_filter=range)
    return {
        "total_upgrades": data["total_upgrades"],
        "completed_upgrades": data["completed_upgrades"],
        "active_upgrades": data["active_upgrades"],
        "category_distribution": data["category_distribution"],
        "activity_trends": data["activity_trends"]
    }

@router.get("/builders")
def analytics_builders(
    range: str = Query("30d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    data = get_analytics_overview(db, village.id, time_filter=range)
    return data["builder_metrics"]
