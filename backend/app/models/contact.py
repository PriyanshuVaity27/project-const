from sqlalchemy import Column, String, Text, Enum as SQLEnum
from enum import Enum
from app.models.base import BaseModel

class ContactType(str, Enum):
    CLIENT = "client"
    VENDOR = "vendor"
    PARTNER = "partner"
    INVESTOR = "investor"
    OTHER = "other"

class Contact(BaseModel):
    __tablename__ = "contacts"
    
    name = Column(String(100), nullable=False)
    company = Column(String(100))
    contact_type = Column(SQLEnum(ContactType), default=ContactType.CLIENT)
    email = Column(String(100))
    phone = Column(String(20))
    alternate_phone = Column(String(20))
    address = Column(Text)
    city = Column(String(50))
    state = Column(String(50))
    pincode = Column(String(10))
    notes = Column(Text)
