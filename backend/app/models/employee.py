from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum
from app.models.base import BaseModel

class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class Employee(BaseModel):
    __tablename__ = "employees"
    
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.EMPLOYEE)
    phone = Column(String(20))
    department = Column(String(50))
    
    # Relationships
    assigned_leads = relationship("Lead", back_populates="assigned_employee")
