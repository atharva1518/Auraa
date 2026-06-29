from fastapi import APIRouter, Depends
from app.auth.schemas import LoginRequest, AuthResponse, StandardResponse, UserSchema
from app.auth.service import AuthService
from app.auth.dependencies import get_auth_service, get_current_token

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "Aura Auth Module",
        "version": "0.1.0",
        "database": "not connected",
        "ai": "not connected"
    }

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, service: AuthService = Depends(get_auth_service)):
    return service.authenticate(request.provider, request.id_token)

@router.get("/me", response_model=UserSchema)
async def get_me(token: str = Depends(get_current_token), service: AuthService = Depends(get_auth_service)):
    return service.get_current_user(token)

@router.post("/logout", response_model=StandardResponse)
async def logout(token: str = Depends(get_current_token), service: AuthService = Depends(get_auth_service)):
    return service.logout_user(token)
