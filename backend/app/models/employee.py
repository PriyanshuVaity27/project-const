from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class Employee(BaseModel):
    __tablename__ = "employees"
    
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=True)  # References auth.users
    username = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)
    phone = Column(String(20))
    department = Column(String(50))
    
    # Relationships
    assigned_leads = relationship("Lead", back_populates="assigned_employee")
    assigned_enquiries = relationship("Enquiry", back_populates="assigned_employee")
    uploaded_documents = relationship("Document", back_populates="uploaded_by_employee")