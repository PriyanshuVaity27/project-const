from sqlalchemy import Column, String, Text, ForeignKey, Enum, Numeric, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel

class ProjectType(str, enum.Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    MIXED_USE = "mixed_use"
    INDUSTRIAL = "industrial"

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    UNDER_CONSTRUCTION = "under_construction"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"

class Project(BaseModel):
    __tablename__ = "projects"
    
    name = Column(String(200), nullable=False)
    project_type = Column(Enum(ProjectType), nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
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
    developer_id = Column(UUID(as_uuid=True), ForeignKey("developers.id"))
    
    # Relationships
    developer = relationship("Developer", back_populates="projects")
    inventory_items = relationship("InventoryItem", back_populates="project")