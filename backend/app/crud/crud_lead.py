from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate

class LeadCRUD:
    def get(self, db: Session, id: int) -> Optional[Lead]:
        return db.query(Lead).filter(Lead.id == id).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[Lead]:
        return db.query(Lead).offset(skip).limit(limit).all()
    
    def get_by_employee(self, db: Session, employee_id: int, skip: int = 0, limit: int = 100) -> List[Lead]:
        return db.query(Lead).filter(Lead.assigned_employee_id == employee_id).offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: LeadCreate) -> Lead:
        db_obj = Lead(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db: Session, db_obj: Lead, obj_in: LeadUpdate) -> Lead:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: int) -> Lead:
        obj = db.query(Lead).get(id)
        db.delete(obj)
        db.commit()
        return obj

lead_crud = LeadCRUD()
