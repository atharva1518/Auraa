from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_token, get_auth_service
from app.auth.service import AuthService
from app.profile.schemas import ProfileResolutionResponse
from app.profile.service import ProfileService
from app.profile.dependencies import get_profile_service

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResolutionResponse)
def resolve_profile(
    token: str = Depends(get_current_token),
    auth_service: AuthService = Depends(get_auth_service),
    profile_service: ProfileService = Depends(get_profile_service)
):
    current_user = auth_service.get_current_user(token)
    return profile_service.resolve_profile(current_user.uid)
