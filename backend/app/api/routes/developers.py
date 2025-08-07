from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.developer import Developer, DeveloperCreate, DeveloperUpdate
from app.api.deps import get_current_user
from app.models.developer import Developer as DeveloperModel

router = APIRouter()

@router.get("/", response_model=List[Developer])
def read_developers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    developers = db.query(DeveloperModel).offset(skip).limit(limit).all()
    return developers

@router.post("/", response_model=Developer)
def create_developer(
    developer: DeveloperCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_developer = DeveloperModel(**developer.dict())
    db.add(db_developer)
    db.commit()
    db.refresh(db_developer)
    return db_developer

@router.get("/{developer_id}", response_model=Developer)
def read_developer(
    developer_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    developer = db.query(DeveloperModel).filter(DeveloperModel.id == developer_id).first()
    if developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return developer

@router.put("/{developer_id}", response_model=Developer)
def update_developer(
    developer_id: int,
    developer: DeveloperUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_developer = db.query(DeveloperModel).filter(DeveloperModel.id == developer_id).first()
    if db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    update_data = developer.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_developer, field, value)
    
    db.commit()
    db.refresh(db_developer)
    return db_developer

@router.delete("/{developer_id}", response_model=Developer)
def delete_developer(
    developer_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    developer = db.query(DeveloperModel).filter(DeveloperModel.id == developer_id).first()
    if developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    db.delete(developer)
    db.commit()
    return developer
