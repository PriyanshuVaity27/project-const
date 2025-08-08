from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.employee import UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    full_name: str
    role: UserRole = UserRole.EMPLOYEE
    phone: Optional[str] = None
    department: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

class UserResponse(BaseModel):
    id: str
    username: str
    full_name: str
    role: str
    phone: Optional[str] = None
    department: Optional[str] = None
    is_active: bool
    
    class Config:
        from_attributes = True