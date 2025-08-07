import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.employee import Employee, UserRole
from app.core.security import get_password_hash

def create_admin_user():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(Employee).filter(Employee.username == "admin").first()
        if admin:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin_user = Employee(
            username="admin",
            email="admin@example.com",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        
        # Create employee user
        employee = db.query(Employee).filter(Employee.username == "employee").first()
        if not employee:
            employee_user = Employee(
                username="employee",
                email="employee@example.com",
                full_name="Test Employee",
                hashed_password=get_password_hash("employee123"),
                role=UserRole.EMPLOYEE,
                is_active=True
            )
            db.add(employee_user)
        
        db.commit()
        print("Admin and Employee users created successfully!")
        print("Admin credentials: username=admin, password=admin123")
        print("Employee credentials: username=employee, password=employee123")
        
    except Exception as e:
        print(f"Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
