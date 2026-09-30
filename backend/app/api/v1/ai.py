from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Village, Upgrade, Hero, AIConversation, AIMessage
from app.schemas.schemas import AIChatRequest, AIChatResponse, AIInsightItem
from app.services.village_service import calculate_village_stats, seed_default_village
from ai.assistant import ai_assistant
from ai.insights import generate_ai_insights

router = APIRouter()

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    payload: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    stats = calculate_village_stats(db, village)
    upgrades = db.query(Upgrade).filter(Upgrade.village_id == village.id, Upgrade.status == "active").all()
    heroes = db.query(Hero).filter(Hero.village_id == village.id).all()

    upgrades_data = [
        {"target_name": u.target_name, "to_level": u.to_level, "builder_index": u.builder_index, "completes_at": u.completes_at.isoformat()}
        for u in upgrades
    ]
    heroes_data = [
        {"name": h.name, "level": h.level, "max_level": h.max_level, "is_upgrading": h.is_upgrading}
        for h in heroes
    ]

    # Find or create conversation
    conv = None
    if payload.conversation_id:
        conv = db.query(AIConversation).filter(AIConversation.id == payload.conversation_id, AIConversation.user_id == current_user.id).first()
    if not conv:
        conv = AIConversation(user_id=current_user.id, village_id=village.id, title=payload.message[:40])
        db.add(conv)
        db.flush()

    # Save user message
    user_msg = AIMessage(
        conversation_id=conv.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)

    # Generate response
    ai_result = await ai_assistant.answer_query(
        user_message=payload.message,
        village_stats=stats,
        active_upgrades=upgrades_data,
        heroes=heroes_data
    )

    # Save assistant response
    assistant_msg = AIMessage(
        conversation_id=conv.id,
        role="assistant",
        content=ai_result["reply"],
        structured_context=ai_result["grounded_context"]
    )
    db.add(assistant_msg)
    db.commit()

    return {
        "reply": ai_result["reply"],
        "conversation_id": conv.id,
        "grounded_context": ai_result["grounded_context"],
        "suggested_followups": ai_result["suggested_followups"]
    }

@router.get("/insights", response_model=list[AIInsightItem])
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.user_id == current_user.id).first()
    if not village:
        village = seed_default_village(db, current_user.id, current_user.username)

    stats = calculate_village_stats(db, village)
    upgrades = db.query(Upgrade).filter(Upgrade.village_id == village.id, Upgrade.status == "active").all()
    heroes = db.query(Hero).filter(Hero.village_id == village.id).all()

    upgrades_data = [
        {"target_name": u.target_name, "to_level": u.to_level, "builder_index": u.builder_index, "completes_at": u.completes_at.isoformat()}
        for u in upgrades
    ]
    heroes_data = [
        {"name": h.name, "level": h.level, "max_level": h.max_level, "is_upgrading": h.is_upgrading}
        for h in heroes
    ]

    return generate_ai_insights(stats, upgrades_data, heroes_data)
