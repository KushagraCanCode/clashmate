import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, Text, JSON, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    country = Column(String(50), default="Global")
    timezone = Column(String(50), default="UTC")
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    villages = relationship("Village", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    busy_sessions = relationship("BusySession", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    notification_preferences = relationship("NotificationPreference", back_populates="user", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")
    public_profile = relationship("PublicProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    analytics_events = relationship("AnalyticsEvent", back_populates="user", cascade="all, delete-orphan")


class Village(Base):
    __tablename__ = "villages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), default="My Chief Village")
    player_tag = Column(String(20), index=True, default="#CLASHMATE")
    town_hall_level = Column(Integer, default=15)
    builder_count = Column(Integer, default=6)
    builder_hall_level = Column(Integer, default=10)
    war_stars = Column(Integer, default=1240)
    trophies = Column(Integer, default=4850)
    highest_trophies = Column(Integer, default=5240)
    clan_name = Column(String(100), default="Legends Alliance")
    sync_mode = Column(String(50), default="manual_companion")  # purely companion tracker
    last_synced_at = Column(DateTime(timezone=True), default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    owner = relationship("User", back_populates="villages")
    buildings = relationship("Building", back_populates="village", cascade="all, delete-orphan")
    heroes = relationship("Hero", back_populates="village", cascade="all, delete-orphan")
    troops = relationship("Troop", back_populates="village", cascade="all, delete-orphan")
    builders = relationship("Builder", back_populates="village", cascade="all, delete-orphan")
    upgrades = relationship("Upgrade", back_populates="village", cascade="all, delete-orphan")


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="defenses")  # townhall, defenses, resources, army, traps, walls, other
    level = Column(Integer, default=1)
    max_level = Column(Integer, default=16)
    count = Column(Integer, default=1)
    is_upgrading = Column(Boolean, default=False)
    icon_name = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    village = relationship("Village", back_populates="buildings")


class Hero(Base):
    __tablename__ = "heroes"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)  # Barbarian King, Archer Queen, Grand Warden, Royal Champion
    level = Column(Integer, default=80)
    max_level = Column(Integer, default=95)
    ability_level = Column(Integer, default=16)
    is_upgrading = Column(Boolean, default=False)
    pet_assigned = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    village = relationship("Village", back_populates="heroes")


class Troop(Base):
    __tablename__ = "troops"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    category = Column(String(50), default="troops")  # troops, dark_troops, spells, siege, pets
    level = Column(Integer, default=10)
    max_level = Column(Integer, default=12)
    is_researching = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    village = relationship("Village", back_populates="troops")


class Builder(Base):
    __tablename__ = "builders"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    builder_index = Column(Integer, nullable=False)  # 1 to 6 (6 is B.O.B / Master Builder)
    name = Column(String(50), default="Hut Builder")
    status = Column(String(20), default="free")  # free, busy
    current_target_name = Column(String(100), nullable=True)
    finishes_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    village = relationship("Village", back_populates="builders")


class Upgrade(Base):
    __tablename__ = "upgrades"

    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), default="building")  # building, hero, troop, spell, pet
    target_name = Column(String(100), nullable=False)
    from_level = Column(Integer, default=1)
    to_level = Column(Integer, default=2)
    builder_index = Column(Integer, default=1)  # 0 for Laboratory
    cost_type = Column(String(20), default="gold")  # gold, elixir, dark_elixir, ore
    cost_amount = Column(Integer, default=1000000)
    duration_seconds = Column(Integer, default=86400)
    started_at = Column(DateTime(timezone=True), default=utcnow)
    completes_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="active")  # active, completed, cancelled
    reminder_enabled = Column(Boolean, default=True)
    reminder_sent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    village = relationship("Village", back_populates="upgrades")


class BusySession(Base):
    __tablename__ = "busy_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    duration_label = Column(String(50), default="4 hours")
    duration_seconds = Column(Integer, default=14400)
    start_time = Column(DateTime(timezone=True), default=utcnow)
    end_time = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    allow_critical_only = Column(Boolean, default=True)
    notify_hero_finish = Column(Boolean, default=True)
    notify_lab_finish = Column(Boolean, default=True)
    next_event_title = Column(String(150), nullable=True)
    next_event_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="busy_sessions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="upgrade")  # upgrade, hero, lab, busy_mode, daily_summary, system
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(200), default="/upgrades")
    is_read = Column(Boolean, default=False)
    scheduled_for = Column(DateTime(timezone=True), default=utcnow)
    sent_at = Column(DateTime(timezone=True), default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="notifications")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Theme & Layout
    theme = Column(String(20), default="dark")  # dark, light, system
    ui_density = Column(String(20), default="comfortable")  # comfortable, compact
    
    # Independent Notification Toggles
    upgrade_alerts = Column(Boolean, default=True)
    builder_alerts = Column(Boolean, default=True)
    hero_alerts = Column(Boolean, default=True)
    laboratory_alerts = Column(Boolean, default=True)
    resource_alerts = Column(Boolean, default=False)
    daily_summary = Column(Boolean, default=True)
    weekly_report = Column(Boolean, default=True)
    ai_insights = Column(Boolean, default=True)
    
    # Channel & Timing
    notification_channel = Column(String(50), default="push")  # push, email, discord
    notification_timing = Column(String(50), default="15m_before")  # immediately, 5m_before, 15m_before, 30m_before, 1h_before
    
    # Quiet Hours
    quiet_hours_enabled = Column(Boolean, default=True)
    quiet_hours_start = Column(String(10), default="23:00")
    quiet_hours_end = Column(String(10), default="07:00")
    quiet_hours_critical_only = Column(Boolean, default=True)
    
    # Busy Mode Defaults
    busy_mode_default_duration = Column(String(20), default="4h")
    busy_mode_hero_alerts = Column(Boolean, default=True)
    busy_mode_lab_alerts = Column(Boolean, default=True)
    
    # AI Settings
    ai_enabled = Column(Boolean, default=True)
    ai_chat = Column(Boolean, default=True)
    ai_daily_summary = Column(Boolean, default=True)
    
    # Privacy
    is_profile_public = Column(Boolean, default=False)
    analytics_visibility = Column(String(20), default="private")
    data_sharing_preferences = Column(String(20), default="minimal")

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="settings")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String(50), default="push")  # push, email, discord, webhook
    destination = Column(String(255), nullable=True)  # email address, webhook URL, token
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="notification_preferences")


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    village_id = Column(Integer, nullable=True)
    event_type = Column(String(50), nullable=False)  # upgrade_start, upgrade_complete, busy_start, ai_query
    event_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="analytics_events")


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    village_id = Column(Integer, nullable=True)
    title = Column(String(150), default="Village Strategic Consultation")
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    structured_context = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    conversation = relationship("AIConversation", back_populates="messages")


class PublicProfile(Base):
    __tablename__ = "public_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    is_public = Column(Boolean, default=True)
    show_town_hall = Column(Boolean, default=True)
    show_progress = Column(Boolean, default=True)
    show_statistics = Column(Boolean, default=True)
    show_achievements = Column(Boolean, default=True)
    bio = Column(String(250), default="Passionate Clash of Clans Chief & Strategist")
    badge_title = Column(String(50), default="Master Strategist")
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="public_profile")
