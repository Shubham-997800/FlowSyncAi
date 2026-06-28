import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import ForgotPassword from '../pages/Authentication/ForgotPassword'
import Dashboard from '../pages/Dashboard/Dashboard'
import TaskManager from '../pages/TaskManager/TaskManager'
import AIPlanner from '../pages/AIPlanner/AIPlanner'
import Calendar from '../pages/Calendar/Calendar'
import FocusMode from '../pages/FocusMode/FocusMode'
import Goals from '../pages/Goals/Goals'
import Habits from '../pages/Habits/Habits'
import Notifications from '../pages/Notifications/Notifications'
import Analytics from '../pages/Analytics/Analytics'
import Settings from '../pages/Settings/Settings'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route element={<MainLayout />}>
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />
        <Route path="ai-planner" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
        <Route path="goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
