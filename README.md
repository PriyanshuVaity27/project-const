# Real Estate CRM System

A comprehensive full-stack real estate management system built with FastAPI (Python) backend and React (TypeScript) frontend.

## 🚀 Features

- **Authentication & Authorization**: JWT-based login with role-based access control (Admin/Employee)
- **Lead Management**: Track and manage sales leads with status updates
- **Employee Management**: Admin can manage team members and their roles
- **Developer Management**: Manage property developers and their projects
- **Project Management**: Track real estate projects with detailed information
- **Inventory Management**: Manage property inventory with pricing and availability
- **Land Parcel Management**: Track land parcels with documents and ownership
- **Contact Management**: Manage client and business contacts
- **Enquiry Management**: Handle customer enquiries and follow-ups
- **Dashboard Analytics**: Visual insights and statistics
- **Export Functionality**: Export data to CSV format
- **File Upload**: Support for document uploads (AWS S3/Supabase)

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose** (recommended) OR
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **Git**

## 🚀 Quick Start (Docker - Recommended)

### 1. Clone the Repository
\`\`\`bash
git clone <your-repository-url>
cd real-estate-crm
\`\`\`

### 2. Start All Services
\`\`\`bash
# Start all services (database, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f
\`\`\`

### 3. Create Admin User
\`\`\`bash
# Create the default admin user
docker-compose exec backend python create_admin.py
\`\`\`

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432

### 5. Login Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Employee**: username: `employee`, password: `employee123`

### 6. Stop Services
\`\`\`bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
\`\`\`

## 🔧 Manual Setup (Development)

### Backend Setup

#### 1. Navigate to Backend Directory
\`\`\`bash
cd backend
\`\`\`

#### 2. Create Virtual Environment
\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
\`\`\`

#### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

#### 4. Setup PostgreSQL Database
\`\`\`bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
\`\`\`

In PostgreSQL shell:
\`\`\`sql
CREATE DATABASE realestate_db;
CREATE USER realestate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate_user;
\q
\`\`\`

#### 5. Configure Environment Variables
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your database credentials
nano .env
\`\`\`

Update `.env` file:
\`\`\`env
DATABASE_URL=postgresql://realestate_user:your_password@localhost:5432/realestate_db
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
\`\`\`

#### 6. Run Database Migrations
\`\`\`bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
\`\`\`

#### 7. Create Admin User
\`\`\`bash
python create_admin.py
\`\`\`

#### 8. Start Backend Server
\`\`\`bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
\`\`\`

### Frontend Setup

#### 1. Navigate to Frontend Directory
\`\`\`bash
cd frontend
\`\`\`

#### 2. Install Dependencies
\`\`\`bash
# Install all dependencies
npm install

# Or using yarn
yarn install
\`\`\`

#### 3. Configure Environment Variables
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit the .env file
nano .env
\`\`\`

Update `.env` file:
\`\`\`env
VITE_API_BASE_URL=http://localhost:8000
\`\`\`

#### 4. Start Development Server
\`\`\`bash
# Start development server
npm run dev

# Or using yarn
yarn dev
\`\`\`

#### 5. Build for Production
\`\`\`bash
# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 🗄 Database Management

### Reset Database
\`\`\`bash
# Using Docker
docker-compose exec backend alembic downgrade base
docker-compose exec backend alembic upgrade head
docker-compose exec backend python create_admin.py

# Manual setup
alembic downgrade base
alembic upgrade head
python create_admin.py
\`\`\`

### Create New Migration
\`\`\`bash
# After making model changes
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
\`\`\`

### Backup Database
\`\`\`bash
# Using Docker
docker-compose exec db pg_dump -U postgres realestate_db > backup.sql

# Manual setup
pg_dump -U realestate_user -h localhost realestate_db > backup.sql
\`\`\`

### Restore Database
\`\`\`bash
# Using Docker
docker-compose exec -T db psql -U postgres realestate_db < backup.sql

# Manual setup
psql -U realestate_user -h localhost realestate_db < backup.sql
\`\`\`

## 🚀 Production Deployment

### Deploy Backend (Render/Railway/Heroku)

#### 1. Prepare for Deployment
\`\`\`bash
# Ensure requirements.txt is up to date
pip freeze > requirements.txt

# Create Procfile for Heroku
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
\`\`\`

#### 2. Environment Variables for Production
Set these environment variables in your hosting platform:
\`\`\`env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_HOSTS=["https://your-frontend-domain.com"]
\`\`\`

#### 3. Deploy Commands
\`\`\`bash
# For Railway
railway login
railway link
railway up

# For Render
# Connect your GitHub repository and set build command:
# pip install -r requirements.txt
# Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
\`\`\`

### Deploy Frontend (Vercel/Netlify)

#### 1. Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `18.x`

#### 2. Environment Variables
\`\`\`env
VITE_API_BASE_URL=https://your-backend-domain.com
\`\`\`

#### 3. Deploy with Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set production environment variables
vercel env add VITE_API_BASE_URL
\`\`\`

### Database (Supabase/Neon)

#### 1. Create Supabase Project
\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login and create project
supabase login
supabase projects create your-project-name
\`\`\`

#### 2. Get Connection String
- Go to Settings > Database
- Copy the connection string
- Update your backend environment variables

## 🔍 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend

# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
\`\`\`bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -l

# Test connection
psql -U realestate_user -h localhost -d realestate_db
\`\`\`

#### 2. Port Already in Use
\`\`\`bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
\`\`\`

#### 3. Frontend Build Issues
\`\`\`bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
\`\`\`

#### 4. Docker Issues
\`\`\`bash
# Rebuild containers
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
docker system prune -a

# View container logs
docker-compose logs backend
docker-compose logs frontend
\`\`\`

### Environment-Specific Issues

#### Development
- Ensure all environment variables are set
- Check that database is running and accessible
- Verify Python virtual environment is activated

#### Production
- Check environment variables in hosting platform
- Ensure database URL is correct for production
- Verify CORS settings allow your frontend domain

## 📝 Default Data

The application comes with:
- **Admin User**: username: `admin`, password: `admin123`
- **Employee User**: username: `employee`, password: `employee123`
- Sample data for testing (optional)

## 🔐 Security Notes

### For Production:
1. Change default passwords immediately
2. Use strong, unique SECRET_KEY
3. Enable HTTPS
4. Configure proper CORS settings
5. Use environment variables for sensitive data
6. Regular security updates

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check application logs
4. Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🎉**
