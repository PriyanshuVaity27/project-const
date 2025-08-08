from sqlalchemy import Column, String, Text, ForeignKey, Enum, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel

class EnquiryStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class EnquiryType(str, enum.Enum):
    PURCHASE = "purchase"
    RENTAL = "rental"
    INVESTMENT = "investment"
    GENERAL = "general"

class Enquiry(BaseModel):
    __tablename__ = "enquiries"
    
    subject = Column(String(200), nullable=False)
    enquiry_type = Column(Enum(EnquiryType), default=EnquiryType.GENERAL)
    status = Column(Enum(EnquiryStatus), default=EnquiryStatus.OPEN)
    customer_name = Column(String(100))
    customer_email = Column(String(100))
    customer_phone = Column(String(20))
    budget = Column(Numeric(12, 2))
    preferred_location = Column(String(200))
    requirements = Column(Text)
    description = Column(Text)
    response = Column(Text)
    
    # Foreign Keys
    assigned_employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    
    # Relationships
    assigned_employee = relationship("Employee", back_populates="assigned_enquiries")