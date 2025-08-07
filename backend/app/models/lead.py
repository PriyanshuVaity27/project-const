from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.orm import relationship
from enum import Enum
from app.models.base import BaseModel

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class LeadSource(str, Enum):
    WEBSITE = "website"
    REFERRAL = "referral"
    SOCIAL_MEDIA = "social_media"
    ADVERTISEMENT = "advertisement"
    COLD_CALL = "cold_call"
    OTHER = "other"

class Lead(BaseModel):
    __tablename__ = "leads"
    
    name = Column(String(100), nullable=False)
    email = Column(String(100))
    phone = Column(String(20))
    company = Column(String(100))
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW)
    source = Column(SQLEnum(LeadSource), default=LeadSource.WEBSITE)
    budget = Column(Numeric(12, 2))
    requirements = Column(Text)
    notes = Column(Text)
    
    # Foreign Keys
    assigned_employee_id = Column(Integer, ForeignKey("employees.id"))
    
    # Relationships
    assigned_employee = relationship("Employee", back_populates="assigned_leads")
