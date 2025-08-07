from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.enquiry import Enquiry
from app.schemas.enquiry import EnquiryCreate, EnquiryUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_enquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    enquiries = db.query(Enquiry).offset(skip).limit(limit).all()
    return [
        {
            "id": e.id,
            "subject": e.subject,
            "enquiry_type": e.enquiry_type,
            "status": e.status,
            "customer_name": e.customer_name,
            "customer_email": e.customer_email,
            "customer_phone": e.customer_phone,
            "budget": float(e.budget) if e.budget else None,
            "assigned_employee_id": e.assigned_employee_id,
            "is_active": e.is_active
        }
        for e in enquiries
    ]

@router.post("/", response_model=dict)
def create_enquiry(
    enquiry: EnquiryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_enquiry = Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return {
        "id": db_enquiry.id,
        "subject": db_enquiry.subject,
        "enquiry_type": db_enquiry.enquiry_type,
        "status": db_enquiry.status,
        "customer_name": db_enquiry.customer_name,
        "customer_email": db_enquiry.customer_email,
        "customer_phone": db_enquiry.customer_phone,
        "budget": float(db_enquiry.budget) if db_enquiry.budget else None,
        "assigned_employee_id": db_enquiry.assigned_employee_id,
        "is_active": db_enquiry.is_active
    }

@router.get("/{enquiry_id}", response_model=dict)
def read_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {
        "id": enquiry.id,
        "subject": enquiry.subject,
        "enquiry_type": enquiry.enquiry_type,
        "status": enquiry.status,
        "customer_name": enquiry.customer_name,
        "customer_email": enquiry.customer_email,
        "customer_phone": enquiry.customer_phone,
        "budget": float(enquiry.budget) if enquiry.budget else None,
        "assigned_employee_id": enquiry.assigned_employee_id,
        "is_active": enquiry.is_active
    }

@router.put("/{enquiry_id}", response_model=dict)
def update_enquiry(
    enquiry_id: int,
    enquiry: EnquiryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if db_enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    update_data = enquiry.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_enquiry, field, value)
    
    db.commit()
    db.refresh(db_enquiry)
    return {
        "id": db_enquiry.id,
        "subject": db_enquiry.subject,
        "enquiry_type": db_enquiry.enquiry_type,
        "status": db_enquiry.status,
        "customer_name": db_enquiry.customer_name,
        "customer_email": db_enquiry.customer_email,
        "customer_phone": db_enquiry.customer_phone,
        "budget": float(db_enquiry.budget) if db_enquiry.budget else None,
        "assigned_employee_id": db_enquiry.assigned_employee_id,
        "is_active": db_enquiry.is_active
    }

@router.delete("/{enquiry_id}")
def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    db.delete(enquiry)
    db.commit()
    return {"message": "Enquiry deleted successfully"}
