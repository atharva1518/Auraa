from pydantic import BaseModel
from typing import Optional

class ProfileResolutionResponse(BaseModel):
    exists: bool
    role: Optional[str] = None
    user_id: Optional[str] = None
    onboarding_required: Optional[bool] = None
