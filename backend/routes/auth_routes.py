from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ['name', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'candidate')
        
        user, message = AuthService.register_user(name, email, password, role)
        
        if not user:
            return jsonify({'error': message}), 400
        
        return jsonify({
            'message': message,
            'user': user.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        result, message = AuthService.login_user(email, password)
        
        if not result:
            return jsonify({'error': message}), 401
        
        return jsonify({
            'message': message,
            'token': result['token'],
            'user': result['user'].to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        
        user = AuthService.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
