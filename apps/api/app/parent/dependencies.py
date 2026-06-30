from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.parent.repository import ParentRepository
from app.parent.service import ParentService

def get_parent_repository(db: Session = Depends(get_db)) -> ParentRepository:
    return ParentRepository(db)

def get_parent_service(repository: ParentRepository = Depends(get_parent_repository)) -> ParentService:
    return ParentService(repository)
