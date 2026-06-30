from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.profile.repository import ProfileRepository
from app.profile.service import ProfileService

def get_profile_repository(db: Session = Depends(get_db)) -> ProfileRepository:
    return ProfileRepository(db)

def get_profile_service(repository: ProfileRepository = Depends(get_profile_repository)) -> ProfileService:
    return ProfileService(repository)
