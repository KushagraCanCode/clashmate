import os
from app.core.config import settings

# Lightweight mockable Celery interface for standalone / local operation or full Celery cluster
try:
    from celery import Celery
    celery_app = Celery(
        "clashmate_workers",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND
    )
    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
    )
except ImportError:
    # Fallback worker simulator
    class MockCelery:
        def task(self, *args, **kwargs):
            def decorator(fn):
                def delay(*fargs, **fkwargs):
                    return fn(*fargs, **fkwargs)
                fn.delay = delay
                return fn
            return decorator
    celery_app = MockCelery()
