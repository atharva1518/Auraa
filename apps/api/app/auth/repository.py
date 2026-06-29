from firebase_admin import auth
from app.core.exceptions import AuthException

class AuthRepository:
    def verify_id_token(self, id_token: str):
        try:
            # Verify the ID token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token.get('uid')
            
            if not uid:
                raise ValueError("UID not found in token")
            
            # Extract basic user details embedded in the token
            email = decoded_token.get('email')
            phone_number = decoded_token.get('phone_number')
            display_name = decoded_token.get('name')
            avatar = decoded_token.get('picture')
            
            return {
                "id": uid,
                "email": email,
                "phone_number": phone_number,
                "display_name": display_name,
                "avatar": avatar
            }
        except Exception as e:
            message = getattr(e, 'message', str(e))
            raise AuthException(message=f"Token verification failed: {message}", status_code=401)

    def get_user(self, uid: str):
        try:
            user_record = auth.get_user(uid)
            return {
                "id": user_record.uid,
                "email": user_record.email,
                "phone_number": user_record.phone_number,
                "display_name": user_record.display_name,
                "avatar": user_record.photo_url
            }
        except Exception as e:
            message = getattr(e, 'message', str(e))
            raise AuthException(message=f"User fetch failed: {message}", status_code=401)

    def logout(self, uid: str):
        try:
            # Revoke all refresh tokens for the user
            auth.revoke_refresh_tokens(uid)
        except Exception as e:
            message = getattr(e, 'message', str(e))
            raise AuthException(message=f"Logout failed: {message}", status_code=400)
