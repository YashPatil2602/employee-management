from models.job_model import Job
from database.db import db

class JobService:
    
    @staticmethod
    def create_job(title, company, location, salary, description, requirements):
        """Create a new job posting"""
        job = Job(
            title=title,
            company=company,
            location=location,
            salary=salary,
            description=description,
            requirements=requirements
        )
        db.session.add(job)
        db.session.commit()
        return job
    
    @staticmethod
    def get_all_jobs():
        """Get all job postings"""
        return Job.query.order_by(Job.created_at.desc()).all()
    
    @staticmethod
    def get_job_by_id(job_id):
        """Get job by ID"""
        return Job.query.get(job_id)
    
    @staticmethod
    def update_job(job_id, title, company, location, salary, description, requirements):
        """Update job posting"""
        job = Job.query.get(job_id)
        if not job:
            return None
        
        job.title = title
        job.company = company
        job.location = location
        job.salary = salary
        job.description = description
        job.requirements = requirements
        
        db.session.commit()
        return job
    
    @staticmethod
    def delete_job(job_id):
        """Delete job posting"""
        job = Job.query.get(job_id)
        if not job:
            return False
        
        db.session.delete(job)
        db.session.commit()
        return True
    
    @staticmethod
    def search_jobs(keyword, location=None):
        """Search jobs by keyword and location"""
        query = Job.query
        
        if keyword:
            query = query.filter(
                db.or_(
                    Job.title.ilike(f'%{keyword}%'),
                    Job.description.ilike(f'%{keyword}%')
                )
            )
        
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
        
        return query.order_by(Job.created_at.desc()).all()
