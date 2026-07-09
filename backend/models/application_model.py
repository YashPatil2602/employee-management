from database.db import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    resume_path = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, accepted, rejected
    applied_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_id': self.job_id,
            'user_name': self.user.name,
            'user_email': self.user.email,
            'job_title': self.job.title,
            'company': self.job.company,
            'resume_path': self.resume_path,
            'status': self.status,
            'applied_at': self.applied_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Application User:{self.user_id} Job:{self.job_id}>'
