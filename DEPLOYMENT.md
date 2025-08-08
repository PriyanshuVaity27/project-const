# 🚀 Deployment Guide

## Prerequisites

1. **Supabase Account**: Create account at [supabase.com](https://supabase.com)
2. **Render Account**: For backend deployment
3. **Netlify/Vercel Account**: For frontend deployment

## 📋 Step-by-Step Deployment

### 1. Setup Supabase

1. Create new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your keys:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Go to Settings > Database to get connection string
4. Run the SQL migrations in the SQL Editor:
   - Copy content from `supabase/migrations/create_initial_schema.sql`
   - Copy content from `supabase/migrations/insert_sample_data.sql`

### 2. Deploy Backend (Render)

1. **Create Render Account** at [render.com](https://render.com)

2. **Create Web Service**:
   - Connect your GitHub repository
   - Select `backend` as root directory
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables** (in Render dashboard):
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   SECRET_KEY=your-production-secret-key-generate-new-one
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_HOSTS=["https://your-frontend-domain.netlify.app"]
   ```

4. **Deploy**: Render will automatically deploy your backend

### 3. Deploy Frontend (Netlify)

1. **Create Netlify Account** at [netlify.com](https://netlify.com)

2. **Deploy from Git**:
   - Connect your GitHub repository
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Environment Variables** (in Netlify dashboard):
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   ```

4. **Deploy**: Netlify will build and deploy your frontend

### 4. Create Admin User

After backend deployment, create admin user:

```bash
# Local development
cd backend
python create_admin.py

# Or use Render's shell (in Render dashboard)
python create_admin.py
```

### 5. Update CORS Settings

Update your backend's `ALLOWED_HOSTS` to include your frontend URL:

```python
ALLOWED_HOSTS = [
    "http://localhost:3000",
    "https://your-app.netlify.app",
    "https://your-custom-domain.com"
]
```

## 🔧 Local Development Setup

### Backend Setup

1. **Create Virtual Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run Migrations** (if using Alembic):
   ```bash
   alembic upgrade head
   ```

5. **Create Admin User**:
   ```bash
   python create_admin.py
   ```

6. **Start Backend**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase and backend URLs
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

## 🔐 Security Checklist

### Production Security

- [ ] Change default `SECRET_KEY` to a strong, unique value
- [ ] Use strong passwords for admin accounts
- [ ] Enable HTTPS for all endpoints
- [ ] Configure proper CORS settings
- [ ] Set up proper RLS policies in Supabase
- [ ] Enable Supabase Auth email confirmation
- [ ] Set up proper backup strategies
- [ ] Monitor API usage and set rate limits

### Environment Variables

Never commit these to version control:
- `SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- Production passwords

## 📊 Monitoring & Maintenance

### Supabase Dashboard
- Monitor database usage
- Check API logs
- Review storage usage
- Manage user authentication

### Render Dashboard
- Monitor backend performance
- Check deployment logs
- Scale resources as needed

### Netlify Dashboard
- Monitor frontend deployments
- Check build logs
- Configure custom domains

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Update `ALLOWED_HOSTS` in backend config
2. **Database Connection**: Verify `DATABASE_URL` format
3. **Authentication Issues**: Check Supabase keys and JWT secret
4. **File Upload Issues**: Verify Supabase Storage bucket policies

### Debug Commands

```bash
# Check backend logs
curl https://your-backend.onrender.com/health

# Test database connection
python -c "from app.database import engine; print(engine.execute('SELECT 1').scalar())"

# Test Supabase connection
python -c "from app.services.supabase_service import supabase_service; print('Connected to Supabase')"
```

## 🎉 Success!

Your Real Estate CRM is now deployed with:
- ✅ React SPA frontend on Netlify
- ✅ FastAPI backend on Render  
- ✅ Supabase for database and storage
- ✅ JWT authentication
- ✅ File upload capabilities
- ✅ Role-based access control

**Default Login**: admin@realestate.com / admin123