from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User ---
class UserRegister(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None
    country: Optional[str] = "Global"
    timezone: Optional[str] = "UTC"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    country: str
    timezone: str
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

# --- Village ---
class VillageCreate(BaseModel):
    name: str = "My Chief Village"
    player_tag: str = "#CLASHMATE"
    town_hall_level: int = 15
    builder_count: int = 6
    clan_name: Optional[str] = "Legends Alliance"

class VillageResponse(BaseModel):
    id: int
    user_id: int
    name: str
    player_tag: str
    town_hall_level: int
    builder_count: int
    builder_hall_level: int
    war_stars: int
    trophies: int
    highest_trophies: int
    clan_name: Optional[str]
    sync_mode: str
    last_synced_at: datetime

    class Config:
        from_attributes = True

# --- Buildings ---
class BuildingResponse(BaseModel):
    id: int
    village_id: int
    name: str
    category: str
    level: int
    max_level: int
    count: int
    is_upgrading: bool
    icon_name: Optional[str]

    class Config:
        from_attributes = True

# --- Heroes ---
class HeroResponse(BaseModel):
    id: int
    village_id: int
    name: str
    level: int
    max_level: int
    ability_level: int
    is_upgrading: bool
    pet_assigned: Optional[str]

    class Config:
        from_attributes = True

# --- Troops / Lab ---
class TroopResponse(BaseModel):
    id: int
    village_id: int
    name: str
    category: str
    level: int
    max_level: int
    is_researching: bool

    class Config:
        from_attributes = True

# --- Builders ---
class BuilderResponse(BaseModel):
    id: int
    village_id: int
    builder_index: int
    name: str
    status: str
    current_target_name: Optional[str]
    finishes_at: Optional[datetime]

    class Config:
        from_attributes = True

# --- Upgrades ---
class UpgradeCreate(BaseModel):
    target_type: str = "building"  # building, hero, troop
    target_name: str
    from_level: int
    to_level: int
    builder_index: int = 1  # 0 for laboratory
    cost_type: str = "gold"
    cost_amount: int = 5000000
    duration_seconds: int = 86400  # 1 day default

class UpgradeResponse(BaseModel):
    id: int
    village_id: int
    target_type: str
    target_name: str
    from_level: int
    to_level: int
    builder_index: int
    cost_type: str
    cost_amount: int
    duration_seconds: int
    started_at: datetime
    completes_at: datetime
    status: str
    reminder_enabled: bool
    reminder_sent: bool

    class Config:
        from_attributes = True

# --- Busy Mode ---
class BusyModeStartRequest(BaseModel):
    duration_label: str = "4 hours"
    duration_seconds: int = 14400
    allow_critical_only: bool = True
    notify_hero_finish: bool = True
    notify_lab_finish: bool = True

class BusyModeResponse(BaseModel):
    id: Optional[int]
    is_active: bool
    duration_label: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    allow_critical_only: bool
    notify_hero_finish: bool
    notify_lab_finish: bool
    next_event_title: Optional[str]
    next_event_time: Optional[datetime]

# --- Notifications ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    link: str
    is_read: bool
    sent_at: datetime

    class Config:
        from_attributes = True

# --- Settings ---
class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    ui_density: Optional[str] = None
    upgrade_alerts: Optional[bool] = None
    builder_alerts: Optional[bool] = None
    hero_alerts: Optional[bool] = None
    laboratory_alerts: Optional[bool] = None
    resource_alerts: Optional[bool] = None
    daily_summary: Optional[bool] = None
    weekly_report: Optional[bool] = None
    ai_insights: Optional[bool] = None
    notification_channel: Optional[str] = None
    notification_timing: Optional[str] = None
    quiet_hours_enabled: Optional[bool] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    quiet_hours_critical_only: Optional[bool] = None
    busy_mode_default_duration: Optional[str] = None
    busy_mode_hero_alerts: Optional[bool] = None
    busy_mode_lab_alerts: Optional[bool] = None
    ai_enabled: Optional[bool] = None
    ai_chat: Optional[bool] = None
    ai_daily_summary: Optional[bool] = None
    is_profile_public: Optional[bool] = None
    analytics_visibility: Optional[str] = None
    data_sharing_preferences: Optional[str] = None

class UserSettingsResponse(BaseModel):
    theme: str
    ui_density: str
    upgrade_alerts: bool
    builder_alerts: bool
    hero_alerts: bool
    laboratory_alerts: bool
    resource_alerts: bool
    daily_summary: bool
    weekly_report: bool
    ai_insights: bool
    notification_channel: str
    notification_timing: str
    quiet_hours_enabled: bool
    quiet_hours_start: str
    quiet_hours_end: str
    quiet_hours_critical_only: bool
    busy_mode_default_duration: str
    busy_mode_hero_alerts: bool
    busy_mode_lab_alerts: bool
    ai_enabled: bool
    ai_chat: bool
    ai_daily_summary: bool
    is_profile_public: bool
    analytics_visibility: str
    data_sharing_preferences: str

    class Config:
        from_attributes = True

# --- Public Profile ---
class PublicProfileResponse(BaseModel):
    username: str
    is_public: bool
    show_town_hall: bool
    show_progress: bool
    show_statistics: bool
    show_achievements: bool
    bio: str
    badge_title: str
    town_hall_level: Optional[int] = 15
    war_stars: Optional[int] = 1240
    trophies: Optional[int] = 4850
    village_progress: Optional[float] = 88.5

# --- AI ---
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class AIChatResponse(BaseModel):
    reply: str
    conversation_id: int
    grounded_context: Dict[str, Any]
    suggested_followups: List[str]

class AIInsightItem(BaseModel):
    id: str
    type: str  # recommendation, warning, efficiency, milestone
    title: str
    description: str
    impact: str
    action_label: Optional[str]
    action_url: Optional[str]
