from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import db, init_db
from config import Config
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config.from_object(Config)

# Initialize Database
db.init_app(app)
JWTManager(app)

# Create tables
with app.app_context():
    init_db()

# Register Blueprints
from routes.auth_routes import auth_bp
from routes.job_routes import job_bp
from routes.application_routes import app_bp

app.register_blueprint(auth_bp)
app.register_blueprint(job_bp)
app.register_blueprint(app_bp)

@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'Server is running'}, 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
