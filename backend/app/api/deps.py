from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, get_db
from app.core.security import decode_access_token
from app.models.models import User, Village
from app.services.village_service import seed_default_village

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(
    db: Session = Depends(get_db),
    cred: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> User:
    """Extract authenticated user from JWT token, or auto-provision demo user for preview."""
    if cred and cred.credentials:
        payload = decode_access_token(cred.credentials)
        if payload and "sub" in payload:
            user_id = int(payload["sub"])
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user

    # Auto-find or provision default chief user for demo/guest experience
    user = db.query(User).filter(User.username == "chief_arthur").first()
    if not user:
        from app.core.security import hash_password
        user = User(
            email="chief@clashmate.io",
            username="chief_arthur",
            full_name="Chief Arthur",
            hashed_password=hash_password("clash12345"),
            country="United States",
            timezone="UTC"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        # Seed realistic demo village
        seed_default_village(db, user.id, player_name="Chief Arthur", player_tag="#9V8G2YLL")

    return user
