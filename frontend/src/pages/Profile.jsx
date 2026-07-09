import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar } from 'lucide-react'
import './Profile.css'

function Profile({ user }) {
  const navigate = useNavigate()

  return (
    <div className="container profile-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        Back to Dashboard
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="role-badge">{user?.role}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={20} />
            <div>
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="detail-item">
            <User size={20} />
            <div>
              <label>Account Type</label>
              <p>{user?.role === 'admin' ? 'Administrator' : 'Candidate'}</p>
            </div>
          </div>
          <div className="detail-item">
            <Calendar size={20} />
            <div>
              <label>Member Since</label>
              <p>{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
