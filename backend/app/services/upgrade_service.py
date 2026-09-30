import datetime
from datetime import timedelta, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Upgrade, Builder, Building, Hero, Troop, Village, Notification, AnalyticsEvent
from app.schemas.schemas import UpgradeCreate

def utcnow():
    return datetime.datetime.now(timezone.utc)

def get_village_upgrades(db: Session, village_id: int, status_filter: Optional[str] = None) -> List[Upgrade]:
    """Retrieve all upgrades for a village with optional status filtering."""
    query = db.query(Upgrade).filter(Upgrade.village_id == village_id)
    if status_filter:
        query = query.filter(Upgrade.status == status_filter)
    return query.order_by(Upgrade.completes_at.asc()).all()

def create_upgrade(db: Session, village_id: int, user_id: int, payload: UpgradeCreate) -> Upgrade:
    """Start tracking a new upgrade on a building, hero, or troop."""
    now = utcnow()
    completes_at = now + timedelta(seconds=payload.duration_seconds)

    # 1. Assign builder if needed (builder_index 1..6; 0 is Laboratory)
    builder_to_assign = payload.builder_index
    if payload.target_type in ["building", "hero"]:
        # Find first free builder if requested index is 0 or invalid
        if builder_to_assign <= 0 or builder_to_assign > 6:
            free_builder = db.query(Builder).filter(
                Builder.village_id == village_id,
                Builder.status == "free"
            ).order_by(Builder.builder_index.asc()).first()
            if free_builder:
                builder_to_assign = free_builder.builder_index
            else:
                builder_to_assign = 1  # default fallback
        
        # Mark builder as busy
        builder = db.query(Builder).filter(
            Builder.village_id == village_id,
            Builder.builder_index == builder_to_assign
        ).first()
        if builder:
            builder.status = "busy"
            builder.current_target_name = f"{payload.target_name} (Lv {payload.to_level})"
            builder.finishes_at = completes_at

    # 2. Mark entity upgrading
    if payload.target_type == "building":
        b = db.query(Building).filter(
            Building.village_id == village_id,
            Building.name == payload.target_name
        ).first()
        if b:
            b.is_upgrading = True
    elif payload.target_type == "hero":
        h = db.query(Hero).filter(
            Hero.village_id == village_id,
            Hero.name == payload.target_name
        ).first()
        if h:
            h.is_upgrading = True
    elif payload.target_type == "troop":
        t = db.query(Troop).filter(
            Troop.village_id == village_id,
            Troop.name == payload.target_name
        ).first()
        if t:
            t.is_researching = True

    # 3. Create Upgrade row
    upgrade = Upgrade(
        village_id=village_id,
        target_type=payload.target_type,
        target_name=payload.target_name,
        from_level=payload.from_level,
        to_level=payload.to_level,
        builder_index=builder_to_assign,
        cost_type=payload.cost_type,
        cost_amount=payload.cost_amount,
        duration_seconds=payload.duration_seconds,
        started_at=now,
        completes_at=completes_at,
        status="active",
        reminder_enabled=True,
        reminder_sent=False
    )
    db.add(upgrade)

    # 4. Add Analytics & Notification
    event = AnalyticsEvent(
        user_id=user_id,
        village_id=village_id,
        event_type="upgrade_started",
        event_metadata={
            "target": payload.target_name,
            "to_level": payload.to_level,
            "builder": builder_to_assign
        }
    )
    db.add(event)

    notif = Notification(
        user_id=user_id,
        type="upgrade",
        title=f"Upgrade Queued: {payload.target_name}",
        message=f"{payload.target_name} upgrading to Level {payload.to_level}. Assigned to Builder #{builder_to_assign if builder_to_assign > 0 else 'Laboratory'}.",
        link="/upgrades",
        is_read=False,
        sent_at=now
    )
    db.add(notif)

    db.commit()
    db.refresh(upgrade)
    return upgrade

def complete_upgrade(db: Session, upgrade_id: int, user_id: int) -> Optional[Upgrade]:
    """Manually or automatically mark an upgrade as completed."""
    upgrade = db.query(Upgrade).filter(Upgrade.id == upgrade_id).first()
    if not upgrade or upgrade.status != "active":
        return None

    upgrade.status = "completed"
    now = utcnow()

    # Free builder
    if upgrade.builder_index > 0:
        builder = db.query(Builder).filter(
            Builder.village_id == upgrade.village_id,
            Builder.builder_index == upgrade.builder_index
        ).first()
        if builder:
            builder.status = "free"
            builder.current_target_name = None
            builder.finishes_at = None

    # Upgrade entity level
    if upgrade.target_type == "building":
        b = db.query(Building).filter(
            Building.village_id == upgrade.village_id,
            Building.name == upgrade.target_name
        ).first()
        if b:
            b.level = upgrade.to_level
            b.is_upgrading = False
    elif upgrade.target_type == "hero":
        h = db.query(Hero).filter(
            Hero.village_id == upgrade.village_id,
            Hero.name == upgrade.target_name
        ).first()
        if h:
            h.level = upgrade.to_level
            h.is_upgrading = False
    elif upgrade.target_type == "troop":
        t = db.query(Troop).filter(
            Troop.village_id == upgrade.village_id,
            Troop.name == upgrade.target_name
        ).first()
        if t:
            t.level = upgrade.to_level
            t.is_researching = False

    # Dispatch completion notification
    notif = Notification(
        user_id=user_id,
        type="upgrade",
        title=f"Upgrade Completed: {upgrade.target_name} Lv {upgrade.to_level}",
        message=f"Construction finished! Builder #{upgrade.builder_index} is now available for new orders.",
        link="/builders",
        is_read=False,
        sent_at=now
    )
    db.add(notif)

    db.commit()
    db.refresh(upgrade)
    return upgrade
