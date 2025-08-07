from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.land_parcel import LandParcel
from app.schemas.land_parcel import LandParcelCreate, LandParcelUpdate
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_land_parcels(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    parcels = db.query(LandParcel).offset(skip).limit(limit).all()
    return [
        {
            "id": p.id,
            "survey_number": p.survey_number,
            "village": p.village,
            "district": p.district,
            "state": p.state,
            "area_acres": float(p.area_acres) if p.area_acres else None,
            "land_type": p.land_type,
            "owner_name": p.owner_name,
            "total_value": float(p.total_value) if p.total_value else None,
            "is_active": p.is_active
        }
        for p in parcels
    ]

@router.post("/", response_model=dict)
def create_land_parcel(
    parcel: LandParcelCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_parcel = LandParcel(**parcel.model_dump())
    db.add(db_parcel)
    db.commit()
    db.refresh(db_parcel)
    return {
        "id": db_parcel.id,
        "survey_number": db_parcel.survey_number,
        "village": db_parcel.village,
        "district": db_parcel.district,
        "state": db_parcel.state,
        "area_acres": float(db_parcel.area_acres) if db_parcel.area_acres else None,
        "land_type": db_parcel.land_type,
        "owner_name": db_parcel.owner_name,
        "total_value": float(db_parcel.total_value) if db_parcel.total_value else None,
        "is_active": db_parcel.is_active
    }

@router.get("/{parcel_id}", response_model=dict)
def read_land_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    parcel = db.query(LandParcel).filter(LandParcel.id == parcel_id).first()
    if parcel is None:
        raise HTTPException(status_code=404, detail="Land parcel not found")
    return {
        "id": parcel.id,
        "survey_number": parcel.survey_number,
        "village": parcel.village,
        "district": parcel.district,
        "state": parcel.state,
        "area_acres": float(parcel.area_acres) if parcel.area_acres else None,
        "land_type": parcel.land_type,
        "owner_name": parcel.owner_name,
        "total_value": float(parcel.total_value) if parcel.total_value else None,
        "is_active": parcel.is_active
    }

@router.put("/{parcel_id}", response_model=dict)
def update_land_parcel(
    parcel_id: int,
    parcel: LandParcelUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_parcel = db.query(LandParcel).filter(LandParcel.id == parcel_id).first()
    if db_parcel is None:
        raise HTTPException(status_code=404, detail="Land parcel not found")
    
    update_data = parcel.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_parcel, field, value)
    
    db.commit()
    db.refresh(db_parcel)
    return {
        "id": db_parcel.id,
        "survey_number": db_parcel.survey_number,
        "village": db_parcel.village,
        "district": db_parcel.district,
        "state": db_parcel.state,
        "area_acres": float(db_parcel.area_acres) if db_parcel.area_acres else None,
        "land_type": db_parcel.land_type,
        "owner_name": db_parcel.owner_name,
        "total_value": float(db_parcel.total_value) if db_parcel.total_value else None,
        "is_active": db_parcel.is_active
    }

@router.delete("/{parcel_id}")
def delete_land_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    parcel = db.query(LandParcel).filter(LandParcel.id == parcel_id).first()
    if parcel is None:
        raise HTTPException(status_code=404, detail="Land parcel not found")
    
    db.delete(parcel)
    db.commit()
    return {"message": "Land parcel deleted successfully"}
