#!/usr/bin/env python3
"""
Script to create admin user in Supabase
Run this after setting up your Supabase project and configuring environment variables
"""

import asyncio
import os
from supabase import create_client
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.employee import Employee, UserRole
from app.core.config import settings

async def create_admin_user():
    """Create admin user in Supabase Auth and employees table"""
    
    # Initialize Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    
    # Admin user details
    admin_email = "admin@realestate.com"
    admin_password = "admin123"
    admin_username = "admin"
    admin_full_name = "System Administrator"
    
    try:
        # Create user in Supabase Auth
        print("Creating admin user in Supabase Auth...")
        auth_response = supabase.auth.admin.create_user({
            "email": admin_email,
            "password": admin_password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": admin_full_name,
                "role": "admin"
            }
        })
        
        if auth_response.user:
            user_id = auth_response.user.id
            print(f"✅ Admin user created in Supabase Auth with ID: {user_id}")
            
            # Create employee profile in database
            db = SessionLocal()
            try:
                # Check if employee already exists
                existing_employee = db.query(Employee).filter(Employee.user_id == user_id).first()
                if existing_employee:
                    print("❌ Employee profile already exists!")
                    return
                
                # Create new employee
                admin_employee = Employee(
                    user_id=user_id,
                    username=admin_username,
                    full_name=admin_full_name,
                    role=UserRole.ADMIN,
                    is_active=True
                )
                
                db.add(admin_employee)
                db.commit()
                db.refresh(admin_employee)
                
                print("✅ Admin employee profile created successfully!")
                print(f"📧 Email: {admin_email}")
                print(f"🔑 Password: {admin_password}")
                print(f"👤 Username: {admin_username}")
                print(f"🎭 Role: {admin_employee.role}")
                
            except Exception as e:
                print(f"❌ Error creating employee profile: {e}")
                db.rollback()
            finally:
                db.close()
                
        else:
            print("❌ Failed to create user in Supabase Auth")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Creating admin user...")
    asyncio.run(create_admin_user())