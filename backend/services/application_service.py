from models.application_model import Application
from models.user_model import User
from models.job_model import Job
from database.db import db

class ApplicationService:
    
    @staticmethod
    def create_application(user_id, job_id, resume_path):
        """Create a new job application"""
        # Check if user already applied to this job
        existing = Application.query.filter_by(
            user_id=user_id,
            job_id=job_id
        ).first()
        
        if existing:
            return None, 'Already applied to this job'
        
        application = Application(
            user_id=user_id,
            job_id=job_id,
            resume_path=resume_path
        )
        
        db.session.add(application)
        db.session.commit()
        return application, 'Application submitted successfully'
    
    @staticmethod
    def get_user_applications(user_id):
        """Get all applications by a user"""
        return Application.query.filter_by(user_id=user_id).order_by(
            Application.applied_at.desc()
        ).all()
    
    @staticmethod
    def get_job_applicants(job_id):
        """Get all applicants for a job"""
        return Application.query.filter_by(job_id=job_id).order_by(
            Application.applied_at.desc()
        ).all()
    
    @staticmethod
    def update_application_status(application_id, status):
        """Update application status (pending, accepted, rejected)"""
        if status not in ['pending', 'accepted', 'rejected']:
            return None, 'Invalid status'
        
        application = Application.query.get(application_id)
        if not application:
            return None, 'Application not found'
        
        application.status = status
        db.session.commit()
        return application, 'Status updated successfully'
    
    @staticmethod
    def get_application_by_id(application_id):
        """Get application by ID"""
        return Application.query.get(application_id)
