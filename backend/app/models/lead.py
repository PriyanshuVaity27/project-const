from sqlalchemy import Column, String, Text, ForeignKey, Enum, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel

class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class LeadSource(str, enum.Enum):
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
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    source = Column(Enum(LeadSource), default=LeadSource.WEBSITE)
    budget = Column(Numeric(12, 2))
    requirements = Column(Text)
    notes = Column(Text)
    
    # Foreign Keys
    assigned_employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    
    # Relationships
    assigned_employee = relationship("Employee", back_populates="assigned_leads")