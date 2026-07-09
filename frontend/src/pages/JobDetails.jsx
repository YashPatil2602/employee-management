import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, MapPin, DollarSign } from 'lucide-react'
import { jobService } from '../services/api'
import './JobDetails.css'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJobById(id)
        setJob(response.data.job)
      } catch (err) {
        console.error('Failed to fetch job:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (loading) return <div className="loading"></div>
  if (!job) return <div className="container"><p>Job not found</p></div>

  return (
    <div className="container job-details-container">
      <button className="back-btn" onClick={() => navigate('/jobs')}>
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      <div className="job-details-header">
        <h1>{job.title}</h1>
        <p className="company">{job.company}</p>
      </div>

      <div className="job-details-meta">
        <div className="meta-item">
          <MapPin size={20} />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="meta-item">
            <DollarSign size={20} />
            <span>{job.salary}</span>
          </div>
        )}
        <div className="meta-item">
          <Briefcase size={20} />
          <span>{job.applicants_count} applicants</span>
        </div>
      </div>

      <div className="job-details-content">
        <div className="content-section">
          <h2>About This Position</h2>
          <p>{job.description}</p>
        </div>

        <div className="content-section">
          <h2>Requirements</h2>
          <p>{job.requirements}</p>
        </div>
      </div>

      <button
        className="btn btn-primary btn-large"
        onClick={() => navigate(`/apply/${job.id}`)}
      >
        Apply Now
      </button>
    </div>
  )
}

export default JobDetails
