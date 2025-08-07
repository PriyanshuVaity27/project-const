from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    contacts = db.query(Contact).offset(skip).limit(limit).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "company": c.company,
            "contact_type": c.contact_type,
            "email": c.email,
            "phone": c.phone,
            "city": c.city,
            "state": c.state,
            "is_active": c.is_active
        }
        for c in contacts
    ]

@router.post("/")
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/{contact_id}")
def read_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {
        "id": contact.id,
        "name": contact.name,
        "company": contact.company,
        "contact_type": contact.contact_type,
        "email": contact.email,
        "phone": contact.phone,
        "city": contact.city,
        "state": contact.state,
        "is_active": contact.is_active
    }

@router.put("/{contact_id}")
def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    update_data = contact.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)
    
    db.commit()
    db.refresh(db_contact)
    return {
        "id": db_contact.id,
        "name": db_contact.name,
        "company": db_contact.company,
        "contact_type": db_contact.contact_type,
        "email": db_contact.email,
        "phone": db_contact.phone,
        "city": db_contact.city,
        "state": db_contact.state,
        "is_active": db_contact.is_active
    }

@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}
