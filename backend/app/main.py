import sys
import os

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import (
    auth, villages, buildings, heroes, upgrades, builders,
    busy_mode, notifications, analytics, ai, settings as app_settings, users
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("clashmate")

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ClashMate Backend API - Community-focused Clash of Clans Companion & Timer Platform",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Request Logging & Timing Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - status={response.status_code} - duration={duration:.3f}s")
    return response

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "We couldn't process this request right now. Please try again."}
    )

# Include API v1 Routers
api_v1 = f"{settings.API_V1_STR}"
app.include_router(auth.router, prefix=f"{api_v1}/auth", tags=["Auth"])
app.include_router(villages.router, prefix=f"{api_v1}/villages", tags=["Villages"])
app.include_router(buildings.router, prefix=f"{api_v1}/buildings", tags=["Buildings"])
app.include_router(heroes.router, prefix=f"{api_v1}/heroes", tags=["Heroes"])
app.include_router(upgrades.router, prefix=f"{api_v1}/upgrades", tags=["Upgrades"])
app.include_router(builders.router, prefix=f"{api_v1}/builders", tags=["Builders"])
app.include_router(busy_mode.router, prefix=f"{api_v1}/busy-mode", tags=["Busy Mode"])
app.include_router(notifications.router, prefix=f"{api_v1}/notifications", tags=["Notifications"])
app.include_router(analytics.router, prefix=f"{api_v1}/analytics", tags=["Analytics"])
app.include_router(ai.router, prefix=f"{api_v1}/ai", tags=["AI Strategic Advisor"])
app.include_router(app_settings.router, prefix=f"{api_v1}/settings", tags=["Settings"])
app.include_router(users.router, prefix=f"{api_v1}/users", tags=["Users"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ClashMate API",
        "version": settings.VERSION,
        "tagline": "Your village. Your schedule. Your Clash companion."
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to ClashMate API",
        "docs": "/api/docs",
        "version": "v1"
    }
