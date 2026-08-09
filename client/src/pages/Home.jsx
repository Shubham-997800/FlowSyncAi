import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Landing from './Landing/Landing'

// Entry route: shows the landing page for visitors, but sends
// already-authenticated users straight into the app.
function Home() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  return user ? <Navigate to="/dashboard" replace /> : <Landing />
}

export default Home
