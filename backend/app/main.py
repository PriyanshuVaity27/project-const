from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import logging

from app.api.routes import auth, employees, leads, developers, projects, inventory, land_parcels, contacts, enquiries, files
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Real Estate CRM API",
    description="A comprehensive real estate management system with Supabase integration",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"])
app.include_router(developers.router, prefix="/api/developers", tags=["Developers"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(land_parcels.router, prefix="/api/land-parcels", tags=["Land Parcels"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["Contacts"])
app.include_router(enquiries.router, prefix="/api/enquiries", tags=["Enquiries"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])

@app.get("/")
async def root():
    return {
        "message": "Real Estate CRM API with Supabase", 
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "supabase"}