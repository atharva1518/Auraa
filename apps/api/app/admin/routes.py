from fastapi import APIRouter
from .service import check_health

router = APIRouter()

@router.get("/health")
async def health():
    return check_health()
