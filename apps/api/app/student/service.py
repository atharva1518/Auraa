from typing import Optional
from app.student.repository import StudentRepository
from app.database.models.student import StudentProfile

class StudentService:
    def __init__(self, repository: StudentRepository):
        self.repository = repository

    def create_profile(self, user_id: str, first_name: str, last_name: str, grade_level: Optional[str] = None, school_name: Optional[str] = None) -> StudentProfile:
        if self.repository.exists(user_id):
            raise ValueError("Student profile already exists for this user.")
        return self.repository.create_profile(user_id, first_name, last_name, grade_level, school_name)

    def get_profile(self, user_id: str) -> Optional[StudentProfile]:
        return self.repository.get_profile(user_id)

    def update_profile(self, user_id: str, **kwargs) -> StudentProfile:
        profile = self.repository.get_profile(user_id)
        if not profile:
            raise ValueError("Student profile not found.")
        
        for key, value in kwargs.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)
                
        return self.repository.update_profile(profile)

    def delete_profile(self, user_id: str) -> None:
        profile = self.repository.get_profile(user_id)
        if not profile:
            raise ValueError("Student profile not found.")
        self.repository.delete_profile(profile)

def check_health():
    return {
        "status": "ok",
        "service": "Aura Student Module",
        "version": "0.1.0",
        "database": "connected",
        "ai": "not connected"
    }

