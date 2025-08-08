from sqlalchemy import Column, String, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Document(BaseModel):
    __tablename__ = "documents"
    
    name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    entity_type = Column(String(50))  # 'lead', 'project', 'land_parcel', etc.
    entity_id = Column(UUID(as_uuid=True))
    
    # Foreign Keys
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    
    # Relationships
    uploaded_by_employee = relationship("Employee", back_populates="uploaded_documents")