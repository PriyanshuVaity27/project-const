import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self.bucket_name = settings.AWS_BUCKET_NAME
        else:
            self.s3_client = None
            logger.warning("AWS credentials not configured")
    
    def upload_file(self, file_obj, file_name: str) -> str:
        """Upload file to S3 and return URL"""
        if not self.s3_client:
            raise Exception("S3 not configured")
        
        try:
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, file_name)
            return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{file_name}"
        except ClientError as e:
            logger.error(f"Error uploading file to S3: {e}")
            raise
    
    def delete_file(self, file_name: str) -> bool:
        """Delete file from S3"""
        if not self.s3_client:
            return False
        
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
            return True
        except ClientError as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False

s3_service = S3Service()
