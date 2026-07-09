from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.job_service import JobService

job_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@job_bp.route('', methods=['GET'])
def get_jobs():
    """Get all job postings with optional search"""
    try:
        keyword = request.args.get('keyword')
        location = request.args.get('location')
        
        if keyword or location:
            jobs = JobService.search_jobs(keyword, location)
        else:
            jobs = JobService.get_all_jobs()
        
        return jsonify({
            'jobs': [job.to_dict() for job in jobs],
            'count': len(jobs)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get job details by ID"""
    try:
        job = JobService.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({'job': job.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('', methods=['POST'])
@jwt_required()
def create_job():
    """Create a new job posting (Admin only)"""
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not all(k in data for k in ['title', 'company', 'location', 'description', 'requirements']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        job = JobService.create_job(
            title=data['title'],
            company=data['company'],
            location=data['location'],
            salary=data.get('salary'),
            description=data['description'],
            requirements=data['requirements']
        )
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """Update job posting (Admin only)"""
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        job = JobService.update_job(
            job_id=job_id,
            title=data.get('title'),
            company=data.get('company'),
            location=data.get('location'),
            salary=data.get('salary'),
            description=data.get('description'),
            requirements=data.get('requirements')
        )
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({
            'message': 'Job updated successfully',
            'job': job.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """Delete job posting (Admin only)"""
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        success = JobService.delete_job(job_id)
        
        if not success:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({'message': 'Job deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
