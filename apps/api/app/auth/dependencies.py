from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.repository import AuthRepository
from app.auth.service import AuthService

# Placeholder for future middleware / role-based access
security = HTTPBearer(auto_error=False)

def get_auth_repository() -> AuthRepository:
    return AuthRepository()

def get_auth_service(repo: AuthRepository = Depends(get_auth_repository)) -> AuthService:
    return AuthService(repository=repo)

def get_current_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Extracts the JWT Bearer token from the incoming request.
    """
    if not credentials:
        from app.core.exceptions import AuthException
        raise AuthException(message="Missing authentication token", status_code=401)
    return credentials.credentials
