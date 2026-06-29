from app.auth.repository import AuthRepository
from app.auth.schemas import AuthResponse, UserSchema

class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    def authenticate(self, provider: str, id_token: str) -> AuthResponse:
        # The repository verifies the token without caring if it's Google or Phone
        user_data = self.repository.verify_id_token(id_token)
        
        return AuthResponse(
            authenticated=True,
            provider=provider,
            user=UserSchema(**user_data)
        )

    def get_current_user(self, id_token: str) -> UserSchema:
        # First verify the provided ID token to ensure the request is authenticated
        user_data = self.repository.verify_id_token(id_token)
        
        # Fetch fresh user data from Firebase to ensure we have the latest info
        fresh_user_data = self.repository.get_user(user_data["id"])
        
        return UserSchema(**fresh_user_data)
    
    def logout_user(self, id_token: str):
        # Verify the token to extract the UID
        user_data = self.repository.verify_id_token(id_token)
        
        # Revoke the refresh tokens for that UID
        self.repository.logout(user_data["id"])
        
        return {"success": True, "message": "Logged out successfully"}
