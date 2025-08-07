from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    projects = db.query(Project).offset(skip).limit(limit).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "project_type": p.project_type,
            "status": p.status,
            "location": p.location,
            "total_area": float(p.total_area) if p.total_area else None,
            "total_units": p.total_units,
            "price_per_sqft": float(p.price_per_sqft) if p.price_per_sqft else None,
            "developer_id": p.developer_id,
            "is_active": p.is_active
        }
        for p in projects
    ]

@router.post("/", response_model=dict)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return {
        "id": db_project.id,
        "name": db_project.name,
        "project_type": db_project.project_type,
        "status": db_project.status,
        "location": db_project.location,
        "total_area": float(db_project.total_area) if db_project.total_area else None,
        "total_units": db_project.total_units,
        "price_per_sqft": float(db_project.price_per_sqft) if db_project.price_per_sqft else None,
        "developer_id": db_project.developer_id,
        "is_active": db_project.is_active
    }

@router.get("/{project_id}", response_model=dict)
def read_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": project.id,
        "name": project.name,
        "project_type": project.project_type,
        "status": project.status,
        "location": project.location,
        "total_area": float(project.total_area) if project.total_area else None,
        "total_units": project.total_units,
        "price_per_sqft": float(project.price_per_sqft) if project.price_per_sqft else None,
        "developer_id": project.developer_id,
        "is_active": project.is_active
    }

@router.put("/{project_id}", response_model=dict)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return {
        "id": db_project.id,
        "name": db_project.name,
        "project_type": db_project.project_type,
        "status": db_project.status,
        "location": db_project.location,
        "total_area": float(db_project.total_area) if db_project.total_area else None,
        "total_units": db_project.total_units,
        "price_per_sqft": float(db_project.price_per_sqft) if db_project.price_per_sqft else None,
        "developer_id": db_project.developer_id,
        "is_active": db_project.is_active
    }

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
