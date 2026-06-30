from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.student.repository import StudentRepository
from app.student.service import StudentService

def get_student_repository(db: Session = Depends(get_db)) -> StudentRepository:
    return StudentRepository(db)

def get_student_service(repository: StudentRepository = Depends(get_student_repository)) -> StudentService:
    return StudentService(repository)
