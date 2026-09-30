# ClashMate

> **"Your village. Your schedule. Your Clash companion."**

ClashMate is an unofficial, community-focused Clash of Clans companion platform. Its purpose is to help users monitor their village, track upgrades and timers, receive configurable notifications, view analytics, activate a customizable Busy Mode, and use AI-powered insights while they are away from the game.

---

## 🛡️ Strict Fair Play & Non-Automation Guarantee
**IMPORTANT PRODUCT CONSTRAINT:**  
ClashMate does **NOT** automate gameplay or control the Clash of Clans client. It does **not** implement bots, automatic attacks, automatic resource collection, automatic upgrades, game macros, client manipulation, or any feature that performs gameplay actions on behalf of the player. The user remains in complete manual control of all gameplay actions at all times.

---

## 🌟 Key Features

1. **Dashboard Overview (`/dashboard`)**: Town Hall status, live builder countdowns, hero sleep/awake states, laboratory research tracker, and AI tactical insights.
2. **Signature Busy Mode (`/busy-mode`)**: One-click "I'M BUSY" mode with custom durations (1h, 2h, 4h, 8h, until tomorrow). Filters non-critical noise while alerting for critical hero awakenings and laboratory completions.
3. **Upgrade Timeline Visualizer (`/timeline`)**: Horizontal interactive Gantt-style schedule with Day, Week, and Month views to prevent overlapping builder completions.
4. **Builder Management (`/builders`)**: Real-time status cards for all 6 builders (including B.O.B Module) and historical assignment logs.
5. **Grounded AI Strategic Advisor (`/ai`)**: Natural language chat interface grounded in your live database telemetry. Distinguishes concrete player metrics from strategic advice.
6. **Deep Analytics (`/analytics`)**: Interactive Recharts graphs for builder utilization, resource investment velocity, and upgrade category distributions.
7. **User-Controlled Privacy & Settings (`/settings`)**: Every alert and feature toggle is independent. Easily export data in JSON format or delete your account.
8. **Public Profile (`/profile/[username]`)**: Share achievements, Town Hall level, and war stars with clanmates while respecting your privacy settings.
9. **Zero-Friction Demo Mode**: Instant 1-click access preloaded with realistic Town Hall 15 data.

---

## 🚀 Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Canvas Confetti.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0, PostgreSQL, Redis, Celery background workers.
- **AI Service**: Structured-data retrieval from PostgreSQL, contextual prompts, Gemini & OpenAI integration ready.
- **Infrastructure**: Docker, Docker Compose, GitHub Actions CI.

---

## 🛠️ Quick Start

### Option A: Docker Compose (Recommended)
```bash
cp .env.example .env
docker-compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/api/docs`

### Option B: Local Development
```bash
# 1. Backend:
python -m venv .venv
.venv\Scripts\activate      # On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --app-dir backend --reload --port 8000

# 2. Frontend:
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

```bash
# Run backend pytest suite:
.venv/Scripts/pytest -v
```

---

## 📄 Legal & Fair Play Disclaimer

ClashMate is an unofficial community fan product and is not affiliated with, endorsed, sponsored, or specifically approved by Supercell. Supercell is not responsible for the operation or content of this application. Clash of Clans and its logos are trademarks of Supercell.

---

## 📜 License
MIT License. See [LICENSE](LICENSE) for details.
