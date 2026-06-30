from typing import Optional
from app.profile.repository import ProfileRepository
from app.database.models.user import User

class ProfileService:
    def __init__(self, repository: ProfileRepository):
        self.repository = repository

    def resolve_profile(self, firebase_uid: str) -> dict:
        user = self.repository.get_by_firebase_uid(firebase_uid)
        
        if user:
            return {
                "exists": True,
                "role": user.role,
                "user_id": str(user.id),
                "onboarding_required": False
            }
        else:
            return {
                "exists": False,
                "role": None,
                "user_id": None,
                "onboarding_required": True
            }

    def create_user(self, firebase_uid: str, role: str, email: Optional[str] = None, phone_number: Optional[str] = None) -> User:
        if self.repository.exists(firebase_uid):
            raise ValueError("User with this Firebase UID already exists.")
        return self.repository.create_user(firebase_uid, role, email, phone_number)
        
    def get_user(self, user_id: str) -> Optional[User]:
        return self.repository.get_by_id(user_id)
    
    def update_user(self, user_id: str, **kwargs) -> User:
        user = self.repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found.")
            
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
                
        return self.repository.update(user)
    
    def delete_user(self, user_id: str) -> None:
        user = self.repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found.")
        self.repository.delete(user)
