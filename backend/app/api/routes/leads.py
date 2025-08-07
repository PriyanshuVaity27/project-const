from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.crud_lead import lead_crud
from app.schemas.lead import Lead, LeadCreate, LeadUpdate
from app.api.deps import get_current_user, get_current_admin
from app.models.employee import UserRole

router = APIRouter()

@router.get("/", response_model=List[Lead])
def read_leads(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == UserRole.ADMIN:
        leads = lead_crud.get_multi(db, skip=skip, limit=limit)
    else:
        leads = lead_crud.get_by_employee(db, employee_id=current_user.id, skip=skip, limit=limit)
    return leads

@router.post("/", response_model=Lead)
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != UserRole.ADMIN and not lead.assigned_employee_id:
        lead.assigned_employee_id = current_user.id
    return lead_crud.create(db=db, obj_in=lead)

@router.get("/{lead_id}", response_model=Lead)
def read_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_lead = lead_crud.get(db, id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and db_lead.assigned_employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_lead

@router.put("/{lead_id}", response_model=Lead)
def update_lead(
    lead_id: int,
    lead: LeadUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_lead = lead_crud.get(db, id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and db_lead.assigned_employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return lead_crud.update(db=db, db_obj=db_lead, obj_in=lead)

@router.delete("/{lead_id}", response_model=Lead)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_lead = lead_crud.get(db, id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and db_lead.assigned_employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return lead_crud.delete(db=db, id=lead_id)
