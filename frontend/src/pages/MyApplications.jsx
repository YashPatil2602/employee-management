import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { applicationService } from '../services/api'
import './MyApplications.css'

function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getUserApplications()
        setApplications(response.data.applications)
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const filteredApps = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={20} style={{ color: '#28a745' }} />
      case 'rejected':
        return <AlertCircle size={20} style={{ color: '#dc3545' }} />
      default:
        return <Clock size={20} style={{ color: '#ffc107' }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'status-accepted'
      case 'rejected':
        return 'status-rejected'
      default:
        return 'status-pending'
    }
  }

  if (loading) return <div className="loading"></div>

  return (
    <div className="container applications-container">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the status of all your job applications</p>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({applications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted ({applications.filter(a => a.status === 'accepted').length})
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({applications.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      <div className="applications-list">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} className="application-card">
              <div className="app-header">
                <div className="app-title">
                  <h3>{app.job_title}</h3>
                  <p className="app-company">{app.company}</p>
                </div>
                <div className={`status-badge ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  <span>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                </div>
              </div>
              <div className="app-details">
                <span>Applied on: {new Date(app.applied_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-applications">
            <p>No applications found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplications
