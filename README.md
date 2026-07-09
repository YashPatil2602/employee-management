# Job Portal with Resume Upload

A full-stack Job Portal web application with resume upload, job search, JWT authentication, candidate applications, and admin job management.

## Project Stack

**Frontend:**
- React.js
- Vite
- Axios
- React Router
- Lucide React (Icons)

**Backend:**
- Flask
- Flask-JWT-Extended (JWT Authentication)
- Flask-SQLAlchemy (ORM)
- Flask-CORS
- MySQL

**Database:**
- MySQL

## Features

✅ User Authentication (Login/Register)
✅ JWT Token-based Security
✅ Job Listings & Search
✅ Job Application Workflow
✅ Resume PDF Upload
✅ Candidate Dashboard
✅ Admin Job Management
✅ Applicant Management
✅ Protected Routes
✅ Password Hashing with Bcrypt

## Project Structure

```
job-portal-resume-upload/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── database/
│   │   └── db.py
│   ├── models/
│   │   ├── user_model.py
│   │   ├── job_model.py
│   │   └── application_model.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── job_routes.py
│   │   └── application_routes.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── job_service.py
│   │   └── application_service.py
│   ├── uploads/
│   │   └── resumes/
│   └── utils/
│       ├── jwt_utils.py
│       └── password_utils.py
├── frontend/
│   └── React app (Vite)
├── database/
├── docs/
├── screenshots/
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Database Setup

Create MySQL database and update `.env` file with database credentials.

## Database Tables

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (candidate/admin)
- created_at

### Jobs Table
- id (Primary Key)
- title
- company
- location
- salary
- description
- requirements
- created_at

### Applications Table
- id (Primary Key)
- user_id (Foreign Key)
- job_id (Foreign Key)
- resume_path
- status (pending/accepted/rejected)
- applied_at

## Running the Project

### Backend
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend
```bash
cd frontend
npm run dev
```

## Resume Upload Flow

1. Candidate selects a job
2. Uploads resume PDF
3. Submits application
4. Backend stores resume in `uploads/resumes/`
5. Database stores resume file path
6. Admin can view/download resume

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Job Routes
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/<id>` - Get job details
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/<id>` - Update job (Admin)
- `DELETE /api/jobs/<id>` - Delete job (Admin)

### Application Routes
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications
- `GET /api/applications/<job_id>` - Get applicants for job (Admin)
- `PUT /api/applications/<id>` - Update application status (Admin)

## Environment Variables

Create `.env` file in backend:

```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/job_portal
JWT_SECRET_KEY=your_secret_key_here
JWT_EXPIRATION_HOURS=24
FLASK_ENV=development
```

## Resume Line for LinkedIn/CV

Job Portal with Resume Upload – Built a full-stack job portal using React.js, Flask, MySQL, and JWT authentication. Implemented job listing, search, job application workflow, resume PDF upload, protected routes, and applicant management.

## License

MIT License
