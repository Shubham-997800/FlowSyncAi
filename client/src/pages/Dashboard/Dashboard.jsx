import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Settings, Plus, MessageSquare, ListTodo, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import DashboardCards from './DashboardCards'
import QuickActions from './QuickActions'
import ProductivityScore from './ProductivityScore'
import AIRecommendation from './AIRecommendation'
import DeadlineRisk from './DeadlineRisk'
import TodayTasks from './TodayTasks'
import RecentActivity from './RecentActivity'
import { getTasks, updateTask, deleteTask } from '../../services/taskService'
import toast from 'react-hot-toast'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <ListTodo size={28} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">An unexpected error occurred while loading the dashboard.</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload() }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            Reload Dashboard
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const section = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const WIDGET_KEY = 'flowsync_widgets'
const defaultWidgets = {
  quickActions: true,
  dashboardCards: true,
  todayTasks: true,
  productivityScore: true,
  aiRecommendation: true,
  deadlineRisk: true,
  recentActivity: true,
}

function loadWidgets() {
  try {
    const saved = JSON.parse(localStorage.getItem(WIDGET_KEY))
    return saved ? { ...defaultWidgets, ...saved } : defaultWidgets
  } catch { return defaultWidgets }
}

function filterTasksByPeriod(tasks, period) {
  if (period === 'all') return tasks
  const now = new Date()
  if (period === 'week') {
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return tasks.filter(t => {
      if (!t.deadline) return false
      const d = new Date(t.deadline)
      return d >= start && d < end
    })
  }
  if (period === 'month') {
    return tasks.filter(t => {
      if (!t.deadline) return false
      const d = new Date(t.deadline)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }
  return tasks
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
      <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800">
            <div className="flex justify-between mb-3">
              <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="w-9 h-9 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
            <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded mb-4" />
            <div className="space-y-3">
              {[1,2,3].map(j => (
                <div key={j} className="h-16 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(null)
  const [period, setPeriod] = useState('all')
  const [widgets, setWidgets] = useState(loadWidgets)
  const [showWidgetMenu, setShowWidgetMenu] = useState(false)
  const intervalRef = useRef(null)

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
      setLastSyncTime(Date.now())
    } catch {
      if (!silent) toast.error('Failed to load tasks')
    }
    if (!silent) setLoading(false)
    else setRefreshing(false)
  }, [])

  useEffect(() => {
    fetchTasks()
    intervalRef.current = setInterval(() => fetchTasks(true), 60000)
    const handleVisibility = () => { if (document.visibilityState === 'visible') fetchTasks(true) }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchTasks])

  const handleToggle = useCallback(async (id) => {
    const task = tasks.find(t => t._id === id)
    if (!task) return
    const prevStatus = task.status
    const newStatus = prevStatus === 'done' ? 'todo' : 'done'
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t))
    try { await updateTask(id, { status: newStatus }) } catch { toast.error('Failed to update task') }
  }, [tasks])

  const handleDelete = useCallback(async (id) => {
    const deleted = tasks.find(t => t._id === id)
    setTasks(prev => prev.filter(t => t._id !== id))
    const undo = () => {
      if (deleted) setTasks(prev => [...prev, deleted])
      toast.dismiss()
    }
    toast(
      <div className="flex items-center gap-3">
        <span>Task deleted</span>
        <button onClick={undo} className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">Undo</button>
      </div>,
      { duration: 4000, style: { borderRadius: '12px', background: '#1e293b', color: '#f1f5f9', fontSize: '13px' } }
    )
    try { await deleteTask(id) } catch { toast.error('Failed to delete task') }
  }, [tasks])

  const toggleWidget = (key) => {
    const next = { ...widgets, [key]: !widgets[key] }
    setWidgets(next)
    localStorage.setItem(WIDGET_KEY, JSON.stringify(next))
  }

  const filteredTasks = filterTasksByPeriod(tasks, period)

  const isEmpty = !loading && tasks.length === 0

  const periodOptions = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ]

  const widgetOptions = [
    { key: 'dashboardCards', label: 'Overview Cards' },
    { key: 'quickActions', label: 'Quick Actions' },
    { key: 'todayTasks', label: "Today's Tasks" },
    { key: 'productivityScore', label: 'Productivity Score' },
    { key: 'aiRecommendation', label: 'AI Coach' },
    { key: 'deadlineRisk', label: 'Deadline Risk' },
    { key: 'recentActivity', label: 'Recent Activity' },
  ]

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Dashboard — FlowSync AI</title>
        <meta name="description" content="Your FlowSync AI productivity dashboard with task stats, AI recommendations, deadline risks, and focus tracking." />
      </Helmet>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {loading ? (
          <DashboardSkeleton />
        ) : isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
              <ListTodo size={36} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to FlowSync AI!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
              Your productivity journey starts here. Create your first task or let AI help you plan your day.
            </p>
            <div className="flex gap-3">
              <Link to="/tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
                <Plus size={18} /> Create Task
              </Link>
              <Link to="/ai-planner" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
                <Brain size={18} /> Talk to AI
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div variants={section}>
              <DashboardHeader onRefresh={() => fetchTasks(true)} refreshing={refreshing} lastSyncTime={lastSyncTime} />
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                {periodOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPeriod(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      period === key ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowWidgetMenu(!showWidgetMenu)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                  title="Customize Dashboard"
                >
                  <Settings size={16} />
                </button>
                {showWidgetMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowWidgetMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-56 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 px-1">Show Sections</p>
                      {widgetOptions.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={widgets[key]}
                            onChange={() => toggleWidget(key)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {widgets.dashboardCards && (
              <motion.div variants={section}>
                <DashboardCards tasks={filteredTasks} />
              </motion.div>
            )}

            {widgets.quickActions && (
              <motion.div variants={section}>
                <QuickActions />
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {widgets.todayTasks && (
                <motion.div variants={section}>
                  <TodayTasks tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
                </motion.div>
              )}
              {widgets.productivityScore && (
                <motion.div variants={section}>
                  <ProductivityScore tasks={filteredTasks} />
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {widgets.aiRecommendation && (
                <motion.div variants={section}>
                  <AIRecommendation />
                </motion.div>
              )}
              {widgets.deadlineRisk && (
                <motion.div variants={section}>
                  <DeadlineRisk tasks={filteredTasks} onToggle={handleToggle} />
                </motion.div>
              )}
            </div>

            {widgets.recentActivity && (
              <motion.div variants={section}>
                <RecentActivity tasks={filteredTasks} />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </ErrorBoundary>
  )
}

export default Dashboard
