from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.inventory import InventoryItem
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_inventory(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    items = db.query(InventoryItem).offset(skip).limit(limit).all()
    return [
        {
            "id": item.id,
            "unit_number": item.unit_number,
            "property_type": item.property_type,
            "status": item.status,
            "area": float(item.area) if item.area else None,
            "price": float(item.price) if item.price else None,
            "bedrooms": item.bedrooms,
            "bathrooms": item.bathrooms,
            "project_id": item.project_id,
            "is_active": item.is_active
        }
        for item in items
    ]

@router.post("/", response_model=InventoryResponse)
def create_inventory_item(
    item: InventoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_item = InventoryItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/{item_id}", response_model=InventoryResponse)
def read_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory_item(
    item_id: int,
    item: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}
