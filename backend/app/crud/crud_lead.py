from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate

class CRUDLead(CRUDBase[Lead, LeadCreate, LeadUpdate]):
    def get_by_employee(
        self, db: Session, *, employee_id: str, skip: int = 0, limit: int = 100
    ) -> List[Lead]:
        return (
            db.query(Lead)
            .filter(Lead.assigned_employee_id == employee_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[Lead]:
        return (
            db.query(Lead)
            .filter(Lead.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

lead = CRUDLead(Lead)