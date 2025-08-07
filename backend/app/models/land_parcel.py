from sqlalchemy import Column, String, Text, Numeric, Date, Enum as SQLEnum
from enum import Enum
from app.models.base import BaseModel

class LandType(str, Enum):
    AGRICULTURAL = "agricultural"
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    MIXED = "mixed"

class OwnershipType(str, Enum):
    FREEHOLD = "freehold"
    LEASEHOLD = "leasehold"
    GOVERNMENT = "government"

class LandParcel(BaseModel):
    __tablename__ = "land_parcels"
    
    survey_number = Column(String(50), nullable=False, unique=True)
    village = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    area_acres = Column(Numeric(10, 4))
    area_sqft = Column(Numeric(12, 2))
    land_type = Column(SQLEnum(LandType))
    ownership_type = Column(SQLEnum(OwnershipType))
    owner_name = Column(String(200))
    owner_contact = Column(String(20))
    price_per_acre = Column(Numeric(12, 2))
    total_value = Column(Numeric(15, 2))
    registration_date = Column(Date)
    documents = Column(Text)  # JSON string of document URLs
    notes = Column(Text)
