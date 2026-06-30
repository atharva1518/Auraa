from typing import Optional
from app.parent.repository import ParentRepository
from app.database.models.parent import ParentProfile

class ParentService:
    def __init__(self, repository: ParentRepository):
        self.repository = repository

    def create_profile(self, user_id: str, first_name: str, last_name: str) -> ParentProfile:
        if self.repository.exists(user_id):
            raise ValueError("Parent profile already exists for this user.")
        return self.repository.create_profile(user_id, first_name, last_name)

    def get_profile(self, user_id: str) -> Optional[ParentProfile]:
        return self.repository.get_profile(user_id)

    def update_profile(self, user_id: str, **kwargs) -> ParentProfile:
        profile = self.repository.get_profile(user_id)
        if not profile:
            raise ValueError("Parent profile not found.")
        
        for key, value in kwargs.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)
                
        return self.repository.update_profile(profile)

    def delete_profile(self, user_id: str) -> None:
        profile = self.repository.get_profile(user_id)
        if not profile:
            raise ValueError("Parent profile not found.")
        self.repository.delete_profile(profile)

def check_health():
    return {
        "status": "ok",
        "service": "Aura Parent Module",
        "version": "0.1.0",
        "database": "connected",
        "ai": "not connected"
    }

