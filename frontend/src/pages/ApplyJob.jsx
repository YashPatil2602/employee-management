import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { jobService, applicationService } from '../services/api'
import './ApplyJob.css'

function ApplyJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJobById(id)
        setJob(response.data.job)
      } catch (err) {
        setError('Failed to fetch job details')
      } finally {
        setJobLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setResume(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!resume) {
      setError('Please select a resume file')
      return
    }

    setLoading(true)
    try {
      await applicationService.submitApplication(id, resume)
      setSuccess('Application submitted successfully!')
      setTimeout(() => navigate('/my-applications'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (jobLoading) return <div className="loading"></div>
  if (!job) return <div className="container"><p>Job not found</p></div>

  return (
    <div className="container apply-container">
      <div className="apply-card">
        <h1>Apply for Position</h1>
        <div className="job-summary">
          <h2>{job.title}</h2>
          <p className="company">{job.company}</p>
          <p className="location">📍 {job.location}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Your Resume (PDF)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                id="resume"
              />
              <label htmlFor="resume" className="file-input-label">
                <Upload size={24} />
                <span>
                  {resume ? resume.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>
            <small>Maximum file size: 10MB</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyJob
