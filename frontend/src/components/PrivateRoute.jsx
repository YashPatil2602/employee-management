import { Navigate } from 'react-router-dom'

function PrivateRoute({ isAuthenticated, requiredRole, children }) {
  const user = localStorage.getItem('user')
  const parsedUser = user ? JSON.parse(user) : null

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && parsedUser?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute
