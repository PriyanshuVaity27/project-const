from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

class CRUDEmployee(CRUDBase[Employee, EmployeeCreate, EmployeeUpdate]):
    def get_by_username(self, db: Session, *, username: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.username == username).first()
    
    def get_by_user_id(self, db: Session, *, user_id: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.user_id == user_id).first()

employee = CRUDEmployee(Employee)