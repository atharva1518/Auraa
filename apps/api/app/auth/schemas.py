from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    provider: str
    id_token: str

class UserSchema(BaseModel):
    id: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    display_name: Optional[str] = None
    avatar: Optional[str] = None

class AuthResponse(BaseModel):
    authenticated: bool
    provider: str
    user: UserSchema

class StandardResponse(BaseModel):
    success: bool
    message: str
