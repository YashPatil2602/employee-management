import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import ApplyJob from './pages/ApplyJob'
import MyApplications from './pages/MyApplications'
import AdminJobs from './pages/AdminJobs'
import AddJob from './pages/AddJob'
import Applicants from './pages/Applicants'
import Profile from './pages/Profile'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return <div className="loading" style={{ marginTop: '50px' }}></div>
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute isAuthenticated={isAuthenticated}><Jobs /></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><JobDetails /></PrivateRoute>} />
        <Route path="/apply/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ApplyJob /></PrivateRoute>} />
        <Route path="/my-applications" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyApplications /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile user={user} /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/jobs" element={<PrivateRoute isAuthenticated={isAuthenticated} requiredRole="admin"><AdminJobs /></PrivateRoute>} />
        <Route path="/admin/add-job" element={<PrivateRoute isAuthenticated={isAuthenticated} requiredRole="admin"><AddJob /></PrivateRoute>} />
        <Route path="/admin/applicants/:jobId" element={<PrivateRoute isAuthenticated={isAuthenticated} requiredRole="admin"><Applicants /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
