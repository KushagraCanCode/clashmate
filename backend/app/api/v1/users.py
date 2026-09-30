from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, PublicProfile, Village
from app.schemas.schemas import PublicProfileResponse

router = APIRouter()

@router.get("/{username}/public-profile", response_model=PublicProfileResponse)
def get_public_profile(username: str, db: Session = Depends(get_db)):
    profile = db.query(PublicProfile).filter(PublicProfile.username == username).first()
    if not profile or not profile.is_public:
        raise HTTPException(status_code=404, detail="Chief profile is private or not found.")

    village = db.query(Village).filter(Village.user_id == profile.user_id).first()

    return {
        "username": profile.username,
        "is_public": profile.is_public,
        "show_town_hall": profile.show_town_hall,
        "show_progress": profile.show_progress,
        "show_statistics": profile.show_statistics,
        "show_achievements": profile.show_achievements,
        "bio": profile.bio,
        "badge_title": profile.badge_title,
        "town_hall_level": village.town_hall_level if (village and profile.show_town_hall) else None,
        "war_stars": village.war_stars if (village and profile.show_statistics) else None,
        "trophies": village.trophies if (village and profile.show_statistics) else None,
        "village_progress": 88.4 if profile.show_progress else None
    }
