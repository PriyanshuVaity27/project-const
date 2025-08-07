from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.employee import UserRole

class EmployeeBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    department: Optional[str] = None
    role: UserRole = UserRole.EMPLOYEE

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class Employee(EmployeeBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
