from models.user_model import User
from database.db import db
from utils.jwt_utils import generate_token
from utils.password_utils import verify_password

class AuthService:
    
    @staticmethod
    def register_user(name, email, password, role='candidate'):
        """Register a new user"""
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, 'Email already registered'
        
        # Create new user
        user = User(name=name, email=email, role=role)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return user, 'User registered successfully'
    
    @staticmethod
    def login_user(email, password):
        """Login user and return token"""
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return None, 'User not found'
        
        if not user.check_password(password):
            return None, 'Invalid password'
        
        token = generate_token(user.id, user.email, user.role)
        return {'user': user, 'token': token}, 'Login successful'
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        return User.query.filter_by(email=email).first()
