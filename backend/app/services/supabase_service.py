from supabase import create_client, Client
from app.core.config import settings
import logging
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    
    async def upload_file(self, file_content: bytes, file_name: str, bucket: str = "documents") -> Optional[str]:
        """Upload file to Supabase Storage and return public URL"""
        try:
            # Generate unique filename
            file_extension = file_name.split('.')[-1] if '.' in file_name else ''
            unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
            
            # Upload file
            result = self.supabase.storage.from_(bucket).upload(
                unique_filename,
                file_content,
                file_options={"content-type": "application/octet-stream"}
            )
            
            if result.error:
                logger.error(f"Error uploading file: {result.error}")
                return None
            
            # Get public URL
            public_url = self.supabase.storage.from_(bucket).get_public_url(unique_filename)
            return public_url
            
        except Exception as e:
            logger.error(f"Error uploading file to Supabase: {e}")
            return None
    
    async def delete_file(self, file_path: str, bucket: str = "documents") -> bool:
        """Delete file from Supabase Storage"""
        try:
            result = self.supabase.storage.from_(bucket).remove([file_path])
            return not result.error
        except Exception as e:
            logger.error(f"Error deleting file from Supabase: {e}")
            return False
    
    async def get_file_url(self, file_path: str, bucket: str = "documents") -> Optional[str]:
        """Get public URL for a file"""
        try:
            return self.supabase.storage.from_(bucket).get_public_url(file_path)
        except Exception as e:
            logger.error(f"Error getting file URL: {e}")
            return None
    
    def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Optional[Dict]:
        """Create user profile in employees table"""
        try:
            result = self.supabase.table('employees').insert({
                'user_id': user_id,
                **profile_data
            }).execute()
            
            if result.data:
                return result.data[0]
            return None
            
        except Exception as e:
            logger.error(f"Error creating user profile: {e}")
            return None
    
    def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile from employees table"""
        try:
            result = self.supabase.table('employees').select('*').eq('user_id', user_id).execute()
            
            if result.data:
                return result.data[0]
            return None
            
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            return None

# Global instance
supabase_service = SupabaseService()