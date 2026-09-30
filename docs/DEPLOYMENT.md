# ClashMate Deployment & Operations Guide

## Production Architecture

ClashMate is designed for containerized deployment across any cloud provider (Google Cloud Run, AWS ECS, Kubernetes, or Docker VPS).

### Prerequisites
- Docker Engine 24+ & Docker Compose 2.0+
- Domain name with SSL (reverse proxy like Caddy or Nginx)
- PostgreSQL 15+ & Redis 7+

---

## 1. Quick Local Development Setup

### Backend (Python 3.11):
```bash
# In clashmate root:
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run FastAPI Dev Server:
uvicorn app.main:app --app-dir backend --reload --port 8000
```

### Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 2. Docker Compose Deployment (All Services)

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Start all services in detached mode
docker-compose up -d --build

# 3. Verify container health
docker-compose ps
```

The stack launches:
- `clashmate_frontend`: Port 3000
- `clashmate_backend`: Port 8000
- `clashmate_postgres`: Port 5432
- `clashmate_redis`: Port 6379
- `clashmate_worker`: Background Celery task processing

---

## 3. Running Test Suites

```bash
# Execute Pytest test suite:
.venv/Scripts/pytest -v
```
