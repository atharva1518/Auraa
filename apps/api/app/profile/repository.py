from typing import Optional
from sqlalchemy.orm import Session
from app.database.models.user import User

class ProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, firebase_uid: str, role: str, email: Optional[str] = None, phone_number: Optional[str] = None) -> User:
        user = User(
            firebase_uid=firebase_uid, 
            email=email, 
            phone_number=phone_number, 
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        return self.db.query(User).filter(User.firebase_uid == firebase_uid).first()

    def exists(self, firebase_uid: str) -> bool:
        return self.get_by_firebase_uid(firebase_uid) is not None

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()
