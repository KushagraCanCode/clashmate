-- ClashMate PostgreSQL Schema Initialization
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    hashed_password VARCHAR(255) NOT NULL,
    country VARCHAR(50) DEFAULT 'Global',
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'My Chief Village',
    player_tag VARCHAR(20) DEFAULT '#CLASHMATE',
    town_hall_level INTEGER DEFAULT 15,
    builder_count INTEGER DEFAULT 6,
    builder_hall_level INTEGER DEFAULT 10,
    war_stars INTEGER DEFAULT 1240,
    trophies INTEGER DEFAULT 4850,
    highest_trophies INTEGER DEFAULT 5240,
    clan_name VARCHAR(100) DEFAULT 'Legends Alliance',
    sync_mode VARCHAR(50) DEFAULT 'companion_synced',
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buildings (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'defenses',
    level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 16,
    count INTEGER DEFAULT 1,
    is_upgrading BOOLEAN DEFAULT FALSE,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    level INTEGER DEFAULT 80,
    max_level INTEGER DEFAULT 95,
    ability_level INTEGER DEFAULT 16,
    is_upgrading BOOLEAN DEFAULT FALSE,
    pet_assigned VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS troops (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'troops',
    level INTEGER DEFAULT 10,
    max_level INTEGER DEFAULT 12,
    is_researching BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS builders (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    builder_index INTEGER NOT NULL,
    name VARCHAR(50) DEFAULT 'Hut Builder',
    status VARCHAR(20) DEFAULT 'free',
    current_target_name VARCHAR(100),
    finishes_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upgrades (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    target_type VARCHAR(50) DEFAULT 'building',
    target_name VARCHAR(100) NOT NULL,
    from_level INTEGER DEFAULT 1,
    to_level INTEGER DEFAULT 2,
    builder_index INTEGER DEFAULT 1,
    cost_type VARCHAR(20) DEFAULT 'gold',
    cost_amount INTEGER DEFAULT 1000000,
    duration_seconds INTEGER DEFAULT 86400,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completes_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS busy_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    duration_label VARCHAR(50) DEFAULT '4 hours',
    duration_seconds INTEGER DEFAULT 14400,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    allow_critical_only BOOLEAN DEFAULT TRUE,
    notify_hero_finish BOOLEAN DEFAULT TRUE,
    notify_lab_finish BOOLEAN DEFAULT TRUE,
    next_event_title VARCHAR(150),
    next_event_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'upgrade',
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(200) DEFAULT '/upgrades',
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    ui_density VARCHAR(20) DEFAULT 'comfortable',
    upgrade_alerts BOOLEAN DEFAULT TRUE,
    builder_alerts BOOLEAN DEFAULT TRUE,
    hero_alerts BOOLEAN DEFAULT TRUE,
    laboratory_alerts BOOLEAN DEFAULT TRUE,
    resource_alerts BOOLEAN DEFAULT FALSE,
    daily_summary BOOLEAN DEFAULT TRUE,
    weekly_report BOOLEAN DEFAULT TRUE,
    ai_insights BOOLEAN DEFAULT TRUE,
    notification_channel VARCHAR(50) DEFAULT 'push',
    notification_timing VARCHAR(50) DEFAULT '15m_before',
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start VARCHAR(10) DEFAULT '23:00',
    quiet_hours_end VARCHAR(10) DEFAULT '07:00',
    quiet_hours_critical_only BOOLEAN DEFAULT TRUE,
    busy_mode_default_duration VARCHAR(20) DEFAULT '4h',
    busy_mode_hero_alerts BOOLEAN DEFAULT TRUE,
    busy_mode_lab_alerts BOOLEAN DEFAULT TRUE,
    ai_enabled BOOLEAN DEFAULT TRUE,
    ai_chat BOOLEAN DEFAULT TRUE,
    ai_daily_summary BOOLEAN DEFAULT TRUE,
    is_profile_public BOOLEAN DEFAULT FALSE,
    analytics_visibility VARCHAR(20) DEFAULT 'private',
    data_sharing_preferences VARCHAR(20) DEFAULT 'minimal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    show_town_hall BOOLEAN DEFAULT TRUE,
    show_progress BOOLEAN DEFAULT TRUE,
    show_statistics BOOLEAN DEFAULT TRUE,
    show_achievements BOOLEAN DEFAULT TRUE,
    bio VARCHAR(250) DEFAULT 'Passionate Clash of Clans Chief & Strategist',
    badge_title VARCHAR(50) DEFAULT 'Master Strategist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
