from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db():
    """Initialize database tables"""
    db.create_all()
    print("Database tables created successfully!")

def get_datetime():
    """Get current datetime"""
    return datetime.utcnow()
