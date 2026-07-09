import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth Service
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile')
}

// Job Service
export const jobService = {
  getAllJobs: (keyword = '', location = '') =>
    api.get('/jobs', { params: { keyword, location } }),
  getJobById: (id) =>
    api.get(`/jobs/${id}`),
  createJob: (data) =>
    api.post('/jobs', data),
  updateJob: (id, data) =>
    api.put(`/jobs/${id}`, data),
  deleteJob: (id) =>
    api.delete(`/jobs/${id}`)
}

// Application Service
export const applicationService = {
  submitApplication: (jobId, resumeFile) => {
    const formData = new FormData()
    formData.append('job_id', jobId)
    formData.append('resume', resumeFile)

    return api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getUserApplications: () =>
    api.get('/applications/user'),
  getJobApplicants: (jobId) =>
    api.get(`/applications/job/${jobId}`),
  getApplicationById: (id) =>
    api.get(`/applications/${id}`),
  updateApplicationStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status })
}

export default api
