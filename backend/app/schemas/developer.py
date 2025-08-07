from pydantic import BaseModel, EmailStr
from typing import Optional

class DeveloperBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    established_year: Optional[str] = None
    total_projects: Optional[str] = None
    description: Optional[str] = None

class DeveloperCreate(DeveloperBase):
    pass

class DeveloperUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    established_year: Optional[str] = None
    total_projects: Optional[str] = None
    description: Optional[str] = None

class Developer(DeveloperBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
