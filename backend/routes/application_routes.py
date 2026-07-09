from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.application_service import ApplicationService
from werkzeug.utils import secure_filename
from config import Config
import os
from datetime import datetime

app_bp = Blueprint('applications', __name__, url_prefix='/api/applications')

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def save_resume(file):
    """Save resume file and return path"""
    if not file or not allowed_file(file.filename):
        return None
    
    # Create uploads directory if it doesn't exist
    os.makedirs(Config.RESUME_UPLOAD_FOLDER, exist_ok=True)
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
    filename = timestamp + filename
    
    filepath = os.path.join(Config.RESUME_UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    return filepath

@app_bp.route('', methods=['POST'])
@jwt_required()
def create_application():
    """Submit job application with resume"""
    try:
        user_id = get_jwt_identity()
        
        # Check if job_id is provided
        if 'job_id' not in request.form:
            return jsonify({'error': 'Missing job_id'}), 400
        
        job_id = request.form.get('job_id', type=int)
        
        # Check if resume file is provided
        if 'resume' not in request.files:
            return jsonify({'error': 'Missing resume file'}), 400
        
        resume_file = request.files['resume']
        
        if not resume_file or resume_file.filename == '':
            return jsonify({'error': 'No resume selected'}), 400
        
        if not allowed_file(resume_file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Save resume
        resume_path = save_resume(resume_file)
        
        if not resume_path:
            return jsonify({'error': 'Failed to save resume'}), 500
        
        # Create application
        application, message = ApplicationService.create_application(
            user_id=user_id,
            job_id=job_id,
            resume_path=resume_path
        )
        
        if not application:
            return jsonify({'error': message}), 400
        
        return jsonify({
            'message': message,
            'application': application.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_applications():
    """Get all applications by current user"""
    try:
        user_id = get_jwt_identity()
        applications = ApplicationService.get_user_applications(user_id)
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'count': len(applications)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app_bp.route('/job/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job_applicants(job_id):
    """Get all applicants for a job (Admin only)"""
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        applications = ApplicationService.get_job_applicants(job_id)
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'count': len(applications)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app_bp.route('/<int:application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    """Get application details"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        
        application = ApplicationService.get_application_by_id(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user is the applicant or admin
        if application.user_id != user_id and claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify({'application': application.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app_bp.route('/<int:application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """Update application status (Admin only)"""
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Missing status field'}), 400
        
        application, message = ApplicationService.update_application_status(
            application_id,
            data['status']
        )
        
        if not application:
            return jsonify({'error': message}), 400
        
        return jsonify({
            'message': message,
            'application': application.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
