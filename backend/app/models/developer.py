from sqlalchemy import Column, String, Text, Numeric
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Developer(BaseModel):
    __tablename__ = "developers"
    
    name = Column(String(100), nullable=False)
    contact_person = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    website = Column(String(200))
    established_year = Column(String(4))
    total_projects = Column(String(50))
    description = Column(Text)
    
    # Relationships
    projects = relationship("Project", back_populates="developer")
