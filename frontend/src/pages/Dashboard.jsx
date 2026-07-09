import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, TrendingUp } from 'lucide-react'
import { jobService, applicationService } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ jobs: 0, applications: 0 })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobService.getAllJobs(),
          applicationService.getUserApplications()
        ])
        setStats({
          jobs: jobsRes.data.count,
          applications: appsRes.data.count
        })
        setRecentJobs(jobsRes.data.jobs.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="loading"></div>

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p>Manage your job applications and find your next opportunity</p>
      </div>

      {user.role === 'admin' && (
        <div className="admin-banner">
          <h3>Admin Dashboard</h3>
          <p>You have admin access. Manage jobs and applications.</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <Briefcase size={32} color="#007bff" />
          </div>
          <div className="stat-content">
            <h3>{stats.jobs}</h3>
            <p>Total Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e5f5' }}>
            <FileText size={32} color="#9c27b0" />
          </div>
          <div className="stat-content">
            <h3>{stats.applications}</h3>
            <p>My Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
            <TrendingUp size={32} color="#28a745" />
          </div>
          <div className="stat-content">
            <h3>{Math.floor(Math.random() * 100)}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/my-applications')}>
            View Applications
          </button>
          {user.role === 'admin' && (
            <button className="btn btn-primary" onClick={() => navigate('/admin/jobs')}>
              Manage Jobs
            </button>
          )}
        </div>
      </div>

      <div className="recent-jobs">
        <h2>Recent Job Postings</h2>
        <div className="jobs-list">
          {recentJobs.map((job) => (
            <div key={job.id} className="job-item">
              <div className="job-item-header">
                <h3>{job.title}</h3>
                <span className="job-company">{job.company}</span>
              </div>
              <p className="job-location">📍 {job.location}</p>
              {job.salary && <p className="job-salary">💰 {job.salary}</p>}
              <button
                className="btn btn-primary btn-small"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
