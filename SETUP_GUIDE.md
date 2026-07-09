# Job Portal with Resume Upload - Setup Guide

## 🎯 Project Overview

This is a complete full-stack Job Portal application built with:
- **Backend:** Flask, Flask-JWT-Extended, SQLAlchemy, MySQL
- **Frontend:** React.js, Vite, Axios, React Router
- **Features:** JWT Authentication, Job Listing, Resume Upload, Application Management

## 📦 What's Included

### Backend Setup
1. Complete Flask REST API
2. Database models for Users, Jobs, Applications
3. JWT-based authentication
4. PDF resume upload functionality
5. Role-based access control (Admin/Candidate)

### Frontend Setup
1. React application with Vite
2. All pages: Login, Register, Dashboard, Jobs, Apply, Admin Dashboard
3. Responsive design for mobile and desktop
4. API integration with Axios

## 🚀 Getting Started

### Backend Installation

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Installation

```bash
cd frontend
npm install
```

## 🔧 Configuration

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/job_portal
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_HOURS=24
FLASK_ENV=development
```

## 📊 Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE job_portal;
```

2. Update `DATABASE_URL` in `.env` with your credentials

3. Tables will be auto-created on first run

## ▶️ Running the Application

### Start Backend Server
```bash
cd backend
source venv/bin/activate
python app.py
```
Backend runs on: `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

## 📱 Pages Available

### Candidate Pages
- **Login/Register** - User authentication
- **Dashboard** - Overview with stats
- **Jobs** - Browse and search jobs
- **Job Details** - View full job information
- **Apply Job** - Upload resume and apply
- **My Applications** - Track application status
- **Profile** - View user information

### Admin Pages
- **Admin Dashboard** - Manage all jobs
- **Add Job** - Create new job postings
- **Applicants** - View and manage applications

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with search)
- `GET /api/jobs/<id>` - Get job details
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/<id>` - Update job (Admin)
- `DELETE /api/jobs/<id>` - Delete job (Admin)

### Applications
- `POST /api/applications` - Submit application with resume
- `GET /api/applications/user` - Get user applications
- `GET /api/applications/job/<id>` - Get job applicants (Admin)
- `PUT /api/applications/<id>/status` - Update status (Admin)

## 📝 Database Schema

### Users Table
- id, name, email (unique), password (hashed), role, created_at, updated_at

### Jobs Table
- id, title, company, location, salary, description, requirements, created_at, updated_at

### Applications Table
- id, user_id (FK), job_id (FK), resume_path, status, applied_at, updated_at

## 🎓 Resume Line for CV

```
Job Portal with Resume Upload – Built a full-stack job portal using React.js, Flask, MySQL, and JWT authentication. Implemented job listing, search, job application workflow, resume PDF upload, protected routes, and applicant management.
```

## ⚙️ Technologies Used

**Backend:**
- Flask 3.0.0
- SQLAlchemy 2.0.23
- Flask-JWT-Extended 4.5.3
- PyMySQL 1.1.0
- Bcrypt 4.1.2

**Frontend:**
- React 18.2.0
- Vite 5.0.8
- React Router 6.20.0
- Axios 1.6.0
- Lucide React 0.292.0

## ✨ Features

✅ JWT Authentication
✅ Role-based Access Control
✅ Job Listing & Search
✅ Resume Upload (PDF)
✅ Application Management
✅ Admin Dashboard
✅ Responsive Design
✅ Password Hashing
✅ Protected Routes
✅ Loading States

---

**Ready to deploy!** Follow the setup guide above to get started. 🚀
