import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, Users } from 'lucide-react'
import { jobService } from '../services/api'
import './AdminJobs.css'

function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs()
      setJobs(response.data.jobs)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id)
        setJobs(jobs.filter(job => job.id !== id))
      } catch (err) {
        console.error('Failed to delete job:', err)
      }
    }
  }

  if (loading) return <div className="loading"></div>

  return (
    <div className="container admin-jobs-container">
      <div className="admin-header">
        <h1>Manage Jobs</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/add-job')}
        >
          + Add New Job
        </button>
      </div>

      <div className="jobs-table-wrapper">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="job-title">{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td className="applicants-count">{job.applicants_count}</td>
                <td className="actions">
                  <button
                    className="action-btn view"
                    onClick={() => navigate(`/admin/applicants/${job.id}`)}
                    title="View Applicants"
                  >
                    <Users size={18} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(job.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
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

export default AdminJobs
