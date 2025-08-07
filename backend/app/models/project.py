from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum as SQLEnum, Numeric, Date
from sqlalchemy.orm import relationship
from enum import Enum
from app.models.base import BaseModel

class ProjectType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    MIXED_USE = "mixed_use"
    INDUSTRIAL = "industrial"

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    UNDER_CONSTRUCTION = "under_construction"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"

class Project(BaseModel):
    __tablename__ = "projects"
    
    name = Column(String(200), nullable=False)
    project_type = Column(SQLEnum(ProjectType), nullable=False)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING)
    location = Column(String(200))
    address = Column(Text)
    total_area = Column(Numeric(12, 2))
    built_up_area = Column(Numeric(12, 2))
    total_units = Column(Integer)
    price_per_sqft = Column(Numeric(10, 2))
    total_value = Column(Numeric(15, 2))
    start_date = Column(Date)
    expected_completion = Column(Date)
    description = Column(Text)
    amenities = Column(Text)
    
    # Foreign Keys
    developer_id = Column(Integer, ForeignKey("developers.id"))
    
    # Relationships
    developer = relationship("Developer", back_populates="projects")
    inventory_items = relationship("InventoryItem", back_populates="project")
