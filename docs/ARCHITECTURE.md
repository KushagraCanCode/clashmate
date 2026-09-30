# ClashMate System Architecture

"Your village. Your schedule. Your Clash companion."

ClashMate is designed as an open-access, community-focused companion platform for Clash of Clans. It strictly operates as an offline companion and scheduling assistant without automating gameplay or controlling the game client.

## High-Level Architecture Diagram

```
+-----------------------------------------------------------+
|                      Next.js Frontend                     |
|  - TypeScript, Tailwind CSS, Recharts, Responsive UI      |
|  - Dashboard, Village, Upgrades, Timeline, Busy Mode, AI   |
+-----------------------------+-----------------------------+
                              | REST JSON (JWT Auth)
                              v
+-----------------------------------------------------------+
|                    FastAPI Backend (v1)                   |
|  - Versioned REST APIs (/api/v1/...)                      |
|  - Password Hashing (PBKDF2) & JWT Authentication          |
|  - Grounded Strategic AI Advisor Service                  |
|  - User-Controlled Preferences & Quiet Hours Evaluation    |
+--------------+-----------------------------+--------------+
               |                             |
               v                             v
+------------------------------+ +--------------------------+
|      PostgreSQL Database     | |    Redis Message Broker  |
|  - Users, Villages, Heroes   | |    & Celery Workers      |
|  - Buildings, Upgrades       | |  - Timer monitoring      |
|  - Busy Sessions, Settings   | |  - Notification dispatch |
+------------------------------+ +--------------------------+
```

## Core Components

### 1. Frontend (`/frontend`)
- **Next.js 16 (App Router)** with React 19 and TypeScript.
- **Mobile First & PWA Ready**:
  - Web App Manifest (`/manifest.json`) supporting standalone "Add to Home Screen" installation on iOS & Android.
  - Native thumb-reachable Mobile Bottom Navigation Bar (`MobileBottomNav.tsx`) with safe area insets (`env(safe-area-inset-bottom)`).
  - Floating In-Game Companion HUD (`MobileCompanionHUD.tsx`) providing 1-tap Supercell player tag copy, builder timers, and lock-screen alert simulator.
  - Home Village (TH15) vs Builder Base (BH10 / B.O.B) village mode toggling.
  - Offline Service Worker caching (`/sw.js`).
- **Tailwind CSS & Custom Design System**: Dark-first palette (`#090d16`, `#0f1523`), gold/amber gaming accents (`#f59e0b`), emerald for success, purple for AI.
- **Recharts**: Builder utilization curves, resource expenditure velocity, and category distribution pies.
- **Offline / Mock Fallback Resilience**: Built-in client-side mock fallback so the application presents realistic Town Hall 15 data even during network isolation.

### 2. Backend API (`/backend`)
- **FastAPI**: Asynchronous Python web framework with OpenAPI / Swagger documentation (`/api/docs`).
- **SQLAlchemy 2.0**: Declarative ORM supporting PostgreSQL in production and zero-config SQLite for local development.
- **Security**: PBKDF2-HMAC-SHA256 password salting, HS256 JWT access tokens, CORS middleware, strict validation.

### 3. AI Service (`/ai`)
- **Strategic Advisor**: Grounds every prompt in structured village telemetry (Town Hall level, active builder timers, hero levels, lab research).
- Distinguishes between concrete village facts and strategic recommendations.
- Optional external LLM connectivity via Gemini or OpenAI with tactical deterministic heuristic fallbacks.

### 4. Asynchronous Task Workers (`/workers`)
- **Celery + Redis**: Evaluates upgrade completion timestamps (`completes_at <= now()`), automatically releases builders, expires Busy Mode sessions, and dispatches quiet-hour-compliant notifications.

### 5. Fair Play Compliance Policy
ClashMate strictly forbids bots, automated attacks, automated resource collectors, game macros, or client memory tampering. The player remains exclusively responsible for all gameplay.
