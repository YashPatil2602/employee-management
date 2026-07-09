import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          💼 Job Portal
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isAuthenticated && user ? (
          <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <Link to="/jobs" className="nav-link" onClick={() => setMenuOpen(false)}>
              Jobs
            </Link>
            <Link to="/my-applications" className="nav-link" onClick={() => setMenuOpen(false)}>
              My Applications
            </Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/jobs" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
                <Link to="/admin/add-job" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Add Job
                </Link>
              </>
            )}
            <div className="nav-user">
              <span className="user-name">{user.name}</span>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        ) : (
          <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
