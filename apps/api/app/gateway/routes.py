from fastapi import APIRouter

from app.auth.routes import router as auth_router
from app.student.routes import router as student_router
from app.parent.routes import router as parent_router
from app.admin.routes import router as admin_router
from app.ai.routes import router as ai_router
from app.profile.routes import router as profile_router

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "Aura API",
        "version": "0.1.0",
        "database": "not connected",
        "ai": "not connected"
    }

router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(student_router, prefix="/student", tags=["Student"])
router.include_router(parent_router, prefix="/parent", tags=["Parent"])
router.include_router(admin_router, prefix="/admin", tags=["Admin"])
router.include_router(ai_router, prefix="/ai", tags=["AI"])
router.include_router(profile_router)

