from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os

def generate_token(user_id, user_email, user_role):
    """Generate JWT token for user"""
    additional_claims = {
        'email': user_email,
        'role': user_role
    }
    access_token = create_access_token(
        identity=user_id,
        additional_claims=additional_claims
    )
    return access_token

def get_current_user():
    """Get current user from JWT token"""
    return get_jwt_identity()
