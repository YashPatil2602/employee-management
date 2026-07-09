import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, DollarSign } from 'lucide-react'
import { jobService } from '../services/api'
import './Jobs.css'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (kw = '', loc = '') => {
    setLoading(true)
    try {
      const response = await jobService.getAllJobs(kw, loc)
      setJobs(response.data.jobs)
      setFilteredJobs(response.data.jobs)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(keyword, location)
  }

  const handleReset = () => {
    setKeyword('')
    setLocation('')
    setFilteredJobs(jobs)
  }

  if (loading) return <div className="loading"></div>

  return (
    <div className="container jobs-container">
      <div className="jobs-header">
        <h1>Job Opportunities</h1>
        <p>Find your next career opportunity</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch}>
          <div className="search-group">
            <div className="search-input">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="search-input">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Search by location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h2>{job.title}</h2>
                <span className="job-badge">{job.applicants_count} applications</span>
              </div>
              <p className="job-company">{job.company}</p>
              <div className="job-meta">
                <span className="meta-item">
                  <MapPin size={16} /> {job.location}
                </span>
                {job.salary && (
                  <span className="meta-item">
                    <DollarSign size={16} /> {job.salary}
                  </span>
                )}
              </div>
              <p className="job-description">{job.description.substring(0, 150)}...</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No jobs found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
