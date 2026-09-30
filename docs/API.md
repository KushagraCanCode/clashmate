# ClashMate API Reference (v1)

Base URL: `http://localhost:8000/api/v1`  
Interactive Swagger Docs: `http://localhost:8000/api/docs`

## Authentication (`/auth`)

### `POST /auth/register`
Register a new chief account.
```json
{
  "full_name": "Chief Arthur",
  "username": "chief_arthur",
  "email": "chief@clashmate.io",
  "password": "SecurePassword123!",
  "country": "United States",
  "timezone": "America/New_York"
}
```

### `POST /auth/login`
Authenticate with username or email.
```json
{
  "username_or_email": "chief_arthur",
  "password": "SecurePassword123!"
}
```

### `POST /auth/demo`
Instant 1-click access for reviewers with pre-seeded Town Hall 15 village.

---

## Villages (`/villages`)

### `GET /villages/active/summary`
Returns active village telemetry, progress percentage, builder status, and next event.

### `POST /villages`
Create or connect a new village.

---

## Upgrades (`/upgrades`)

### `GET /upgrades`
Query upgrades. Optional filter `?status=active|completed`.

### `POST /upgrades`
Start tracking an upgrade on a building, hero, or troop.
```json
{
  "target_type": "building",
  "target_name": "Spell Tower",
  "from_level": 2,
  "to_level": 3,
  "builder_index": 5,
  "cost_type": "gold",
  "cost_amount": 16000000,
  "duration_seconds": 1209600
}
```

### `POST /upgrades/{id}/complete`
Manually mark upgrade as completed, freeing the assigned builder immediately.

---

## Busy Mode (`/busy-mode`)

### `GET /busy-mode/status`
Check whether Busy Mode is currently active for the authenticated user.

### `POST /busy-mode/start`
Activate Busy Mode with a duration and notification filters.
```json
{
  "duration_label": "4 hours",
  "duration_seconds": 14400,
  "allow_critical_only": true,
  "notify_hero_finish": true,
  "notify_lab_finish": true
}
```

### `POST /busy-mode/end`
End Busy Mode early and restore standard notification schedules.

---

## AI Strategic Advisor (`/ai`)

### `POST /ai/chat`
Ask natural language questions grounded in structured village telemetry.
```json
{
  "message": "Summarize my village and recommend my next 3 upgrades"
}
```

### `GET /ai/insights`
Returns tactical AI insight cards synthesized from live database telemetry.

---

## Settings (`/settings`)

### `GET /settings` & `PATCH /settings`
Inspect or update user-controlled feature toggles, quiet hours, and privacy flags.

### `GET /settings/export`
Exports all user village data and history in portable JSON format.

### `DELETE /settings/account`
Permanently deletes user account and all associated telemetry.
