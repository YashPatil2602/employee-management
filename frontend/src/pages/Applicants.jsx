import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { applicationService } from '../services/api'
import './Applicants.css'

function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await applicationService.getJobApplicants(jobId)
        setApplicants(response.data.applications)
      } catch (err) {
        console.error('Failed to fetch applicants:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplicants()
  }, [jobId])

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationService.updateApplicationStatus(appId, status)
      setApplicants(applicants.map(app =>
        app.id === appId ? { ...app, status } : app
      ))
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  if (loading) return <div className="loading"></div>

  return (
    <div className="container applicants-container">
      <button className="back-btn" onClick={() => navigate('/admin/jobs')}>
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      <div className="applicants-header">
        <h1>Applicants for {applicants[0]?.job_title || 'Job'}</h1>
        <span className="applicant-count">{applicants.length} applicants</span>
      </div>

      <div className="applicants-table-wrapper">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.id}>
                <td>{app.user_name}</td>
                <td>{app.user_email}</td>
                <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="action-btn accept"
                    onClick={() => handleStatusUpdate(app.id, 'accepted')}
                    disabled={app.status === 'accepted'}
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                    disabled={app.status === 'rejected'}
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Applicants
