from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import User, UserSettings, PublicProfile
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.village_service import seed_default_village

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    # Check duplicate username
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="This username is already taken.")

    user = User(
        email=payload.email,
        username=payload.username,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        country=payload.country or "Global",
        timezone=payload.timezone or "UTC"
    )
    db.add(user)
    db.flush()

    # User settings
    settings = UserSettings(user_id=user.id)
    db.add(settings)

    # Public profile
    profile = PublicProfile(user_id=user.id, username=user.username)
    db.add(profile)

    # Seed default village
    seed_default_village(db, user.id, player_name=user.full_name or user.username)

    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == payload.username_or_email) | (User.email == payload.username_or_email)
    ).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/demo", response_model=TokenResponse)
def demo_login(db: Session = Depends(get_db)):
    """1-Click instant demo login for evaluators and visitors."""
    user = db.query(User).filter(User.username == "chief_arthur").first()
    if not user:
        user = User(
            email="chief@clashmate.io",
            username="chief_arthur",
            full_name="Chief Arthur",
            hashed_password=hash_password("clash12345"),
            country="United States",
            timezone="UTC"
        )
        db.add(user)
        db.flush()
        settings = UserSettings(user_id=user.id)
        db.add(settings)
        profile = PublicProfile(user_id=user.id, username=user.username)
        db.add(profile)
        seed_default_village(db, user.id, player_name="Chief Arthur", player_tag="#9V8G2YLL")
        db.commit()
        db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/forgot-password")
def forgot_password(payload: dict):
    # Simulated password recovery for open community access
    return {"message": "If this email is registered, password reset instructions have been sent."}
