from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from supabase import Client
from app.database import get_db
from app.core.config import settings
from app.core.security import create_access_token, authenticate_with_supabase, create_user_with_supabase
from app.services.supabase_service import supabase_service
from app.schemas.auth import LoginRequest, RegisterRequest, Token, UserResponse
from app.api.deps import get_current_user, get_supabase
from app.models.employee import Employee

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
    supabase: Client = Depends(get_supabase)
):
    # Authenticate with Supabase
    auth_result = authenticate_with_supabase(supabase, login_data.email, login_data.password)
    
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    user = auth_result["user"]
    
    # Get employee profile
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found"
        )
    
    if not employee.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(employee.id),
            "email": user.email,
            "full_name": employee.full_name,
            "role": employee.role,
            "is_active": employee.is_active
        }
    }

@router.post("/register", response_model=Token)
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db),
    supabase: Client = Depends(get_supabase)
):
    # Create user with Supabase Auth
    auth_result = create_user_with_supabase(
        supabase, 
        register_data.email, 
        register_data.password,
        {"full_name": register_data.full_name}
    )
    
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user"
        )
    
    user = auth_result["user"]
    
    # Create employee profile
    employee = Employee(
        user_id=user.id,
        username=register_data.username,
        full_name=register_data.full_name,
        role=register_data.role,
        phone=register_data.phone,
        department=register_data.department
    )
    
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    # Create JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(employee.id),
            "email": user.email,
            "full_name": employee.full_name,
            "role": employee.role,
            "is_active": employee.is_active
        }
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Employee = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "phone": current_user.phone,
        "department": current_user.department,
        "is_active": current_user.is_active
    }

@router.post("/logout")
async def logout(
    supabase: Client = Depends(get_supabase),
    current_user: Employee = Depends(get_current_user)
):
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        return {"message": "Logged out locally"}