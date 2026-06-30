from typing import Optional
from sqlalchemy.orm import Session
from app.database.models.parent import ParentProfile

class ParentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_profile(self, user_id: str, first_name: str, last_name: str) -> ParentProfile:
        profile = ParentProfile(
            user_id=user_id, 
            first_name=first_name, 
            last_name=last_name
        )
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_profile(self, user_id: str) -> Optional[ParentProfile]:
        return self.db.query(ParentProfile).filter(ParentProfile.user_id == user_id).first()

    def exists(self, user_id: str) -> bool:
        return self.get_profile(user_id) is not None

    def update_profile(self, profile: ParentProfile) -> ParentProfile:
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_profile(self, profile: ParentProfile) -> None:
        self.db.delete(profile)
        self.db.commit()
