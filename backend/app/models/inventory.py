from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, Numeric, Boolean
from sqlalchemy.orm import relationship
from enum import Enum
from app.models.base import BaseModel

class PropertyType(str, Enum):
    APARTMENT = "apartment"
    VILLA = "villa"
    PLOT = "plot"
    OFFICE = "office"
    SHOP = "shop"
    WAREHOUSE = "warehouse"

class InventoryStatus(str, Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    RESERVED = "reserved"
    BLOCKED = "blocked"

class InventoryItem(BaseModel):
    __tablename__ = "inventory"
    
    unit_number = Column(String(50), nullable=False)
    property_type = Column(SQLEnum(PropertyType), nullable=False)
    status = Column(SQLEnum(InventoryStatus), default=InventoryStatus.AVAILABLE)
    floor = Column(String(10))
    area = Column(Numeric(10, 2))
    price = Column(Numeric(12, 2))
    price_per_sqft = Column(Numeric(10, 2))
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    parking = Column(Boolean, default=False)
    facing = Column(String(20))
    description = Column(String(500))
    
    # Foreign Keys
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    # Relationships
    project = relationship("Project", back_populates="inventory_items")
