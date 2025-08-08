from sqlalchemy import Column, String, ForeignKey, Enum, Numeric, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel

class PropertyType(str, enum.Enum):
    APARTMENT = "apartment"
    VILLA = "villa"
    PLOT = "plot"
    OFFICE = "office"
    SHOP = "shop"
    WAREHOUSE = "warehouse"

class InventoryStatus(str, enum.Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    RESERVED = "reserved"
    BLOCKED = "blocked"

class InventoryItem(BaseModel):
    __tablename__ = "inventory"
    
    unit_number = Column(String(50), nullable=False)
    property_type = Column(Enum(PropertyType), nullable=False)
    status = Column(Enum(InventoryStatus), default=InventoryStatus.AVAILABLE)
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
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    
    # Relationships
    project = relationship("Project", back_populates="inventory_items")