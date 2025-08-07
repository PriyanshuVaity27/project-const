from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.crud_employee import employee_crud
from app.schemas.employee import Employee, EmployeeCreate, EmployeeUpdate
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()

@router.get("/", response_model=List[Employee])
def read_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    employees = employee_crud.get_multi(db, skip=skip, limit=limit)
    return employees

@router.post("/", response_model=Employee)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_user = employee_crud.get_by_username(db, username=employee.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    db_user = employee_crud.get_by_email(db, email=employee.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return employee_crud.create(db=db, obj_in=employee)

@router.get("/{employee_id}", response_model=Employee)
def read_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_employee = employee_crud.get(db, id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.put("/{employee_id}", response_model=Employee)
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_employee = employee_crud.get(db, id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee_crud.update(db=db, db_obj=db_employee, obj_in=employee)

@router.delete("/{employee_id}", response_model=Employee)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    db_employee = employee_crud.get(db, id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee_crud.delete(db=db, id=employee_id)
