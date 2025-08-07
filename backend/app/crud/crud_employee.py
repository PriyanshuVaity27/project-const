from typing import Optional, List
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

class EmployeeCRUD:
    def get(self, db: Session, id: int) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.id == id).first()
    
    def get_by_username(self, db: Session, username: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.username == username).first()
    
    def get_by_email(self, db: Session, email: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.email == email).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[Employee]:
        return db.query(Employee).offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: EmployeeCreate) -> Employee:
        hashed_password = get_password_hash(obj_in.password)
        db_obj = Employee(
            username=obj_in.username,
            email=obj_in.email,
            full_name=obj_in.full_name,
            hashed_password=hashed_password,
            role=obj_in.role,
            phone=obj_in.phone,
            department=obj_in.department
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db: Session, db_obj: Employee, obj_in: EmployeeUpdate) -> Employee:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: int) -> Employee:
        obj = db.query(Employee).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    def authenticate(self, db: Session, username: str, password: str) -> Optional[Employee]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

employee_crud = EmployeeCRUD()
