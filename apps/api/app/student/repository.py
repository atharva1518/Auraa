from typing import Optional
from sqlalchemy.orm import Session
from app.database.models.student import StudentProfile

class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_profile(self, user_id: str, first_name: str, last_name: str, grade_level: Optional[str] = None, school_name: Optional[str] = None) -> StudentProfile:
        profile = StudentProfile(
            user_id=user_id, 
            first_name=first_name, 
            last_name=last_name, 
            grade_level=grade_level, 
            school_name=school_name
        )
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_profile(self, user_id: str) -> Optional[StudentProfile]:
        return self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    def exists(self, user_id: str) -> bool:
        return self.get_profile(user_id) is not None

    def update_profile(self, profile: StudentProfile) -> StudentProfile:
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_profile(self, profile: StudentProfile) -> None:
        self.db.delete(profile)
        self.db.commit()
