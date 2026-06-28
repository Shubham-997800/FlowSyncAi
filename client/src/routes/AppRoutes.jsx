import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'

const Login = lazy(() => import('../pages/Authentication/Login'))
const Register = lazy(() => import('../pages/Authentication/Register'))
const ForgotPassword = lazy(() => import('../pages/Authentication/ForgotPassword'))
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'))
const TaskManager = lazy(() => import('../pages/TaskManager/TaskManager'))
const AIPlanner = lazy(() => import('../pages/AIPlanner/AIPlanner'))
const Calendar = lazy(() => import('../pages/Calendar/Calendar'))
const FocusMode = lazy(() => import('../pages/FocusMode/FocusMode'))
const Goals = lazy(() => import('../pages/Goals/Goals'))
const Habits = lazy(() => import('../pages/Habits/Habits'))
const Notifications = lazy(() => import('../pages/Notifications/Notifications'))
const Analytics = lazy(() => import('../pages/Analytics/Analytics'))
const Settings = lazy(() => import('../pages/Settings/Settings'))
const Profile = lazy(() => import('../pages/Profile/Profile'))
const NotFound = lazy(() => import('../pages/Error/NotFound'))
const Unauthorized = lazy(() => import('../pages/Error/Unauthorized'))

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

function Lazy({ children }) {
  return <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-950" />}>{children}</Suspense>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<PublicRoute><Lazy><Login /></Lazy></PublicRoute>} />
      <Route path="register" element={<PublicRoute><Lazy><Register /></Lazy></PublicRoute>} />
      <Route path="forgot-password" element={<PublicRoute><Lazy><ForgotPassword /></Lazy></PublicRoute>} />
      <Route element={<MainLayout />}>
        <Route path="dashboard" element={<ProtectedRoute><Lazy><Dashboard /></Lazy></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute><Lazy><TaskManager /></Lazy></ProtectedRoute>} />
        <Route path="ai-planner" element={<ProtectedRoute><Lazy><AIPlanner /></Lazy></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute><Lazy><Calendar /></Lazy></ProtectedRoute>} />
        <Route path="focus" element={<ProtectedRoute><Lazy><FocusMode /></Lazy></ProtectedRoute>} />
        <Route path="goals" element={<ProtectedRoute><Lazy><Goals /></Lazy></ProtectedRoute>} />
        <Route path="habits" element={<ProtectedRoute><Lazy><Habits /></Lazy></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><Lazy><Notifications /></Lazy></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><Lazy><Analytics /></Lazy></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Lazy><Profile /></Lazy></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Lazy><Settings /></Lazy></ProtectedRoute>} />
      </Route>
      <Route path="unauthorized" element={<Lazy><Unauthorized /></Lazy>} />
      <Route path="*" element={<Lazy><NotFound /></Lazy>} />
    </Routes>
  )
}

export default AppRoutes
