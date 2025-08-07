from pydantic import BaseModel, EmailStr
from typing import Optional
from decimal import Decimal
from app.models.lead import LeadStatus, LeadSource

class LeadBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    source: LeadSource = LeadSource.WEBSITE
    budget: Optional[Decimal] = None
    requirements: Optional[str] = None
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    assigned_employee_id: Optional[int] = None

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[LeadStatus] = None
    source: Optional[LeadSource] = None
    budget: Optional[Decimal] = None
    requirements: Optional[str] = None
    notes: Optional[str] = None
    assigned_employee_id: Optional[int] = None

class Lead(LeadBase):
    id: int
    assigned_employee_id: Optional[int] = None
    
    class Config:
        from_attributes = True
