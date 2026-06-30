from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

database_url = settings.database_url

if not database_url or database_url == "<TO_BE_FILLED>":
    raise RuntimeError(
        "DATABASE_URL is not configured. Please configure the PostgreSQL connection before starting the application."
    )

engine = create_engine(database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
