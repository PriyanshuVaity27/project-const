from sqlalchemy import Column, String, Text, Numeric, Date, Enum
from sqlalchemy.dialects.postgresql import JSONB
import enum
from app.models.base import BaseModel

class LandType(str, enum.Enum):
    AGRICULTURAL = "agricultural"
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    MIXED = "mixed"

class LandParcel(BaseModel):
    __tablename__ = "land_parcels"
    
    survey_number = Column(String(50), nullable=False, unique=True)
    village = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    area_acres = Column(Numeric(10, 4))
    area_sqft = Column(Numeric(12, 2))
    land_type = Column(Enum(LandType))
    owner_name = Column(String(200))
    owner_contact = Column(String(20))
    price_per_acre = Column(Numeric(12, 2))
    total_value = Column(Numeric(15, 2))
    registration_date = Column(Date)
    documents = Column(JSONB, default={})  # Store document metadata as JSON
    notes = Column(Text)