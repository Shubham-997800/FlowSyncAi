import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import DashboardHeader from './DashboardHeader'
import DashboardCards from './DashboardCards'
import QuickActions from './QuickActions'
import ProductivityScore from './ProductivityScore'
import AIRecommendation from './AIRecommendation'
import DeadlineRisk from './DeadlineRisk'
import TodayTasks from './TodayTasks'
import RecentActivity from './RecentActivity'
import { getTasks, updateTask, deleteTask } from '../../services/taskService'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const section = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
  const intervalRef = useRef(null)

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true) }
    else { setRefreshing(true) }
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
    if (!silent) { setLoading(false) }
    else { setRefreshing(false) }
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
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t))
    try { await updateTask(id, { status: newStatus }) } catch {}
  }, [tasks])

  const handleDelete = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id))
    try { await deleteTask(id) } catch {}
  }, [])

  return (
    <>
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
        ) : (
          <>
            <motion.div variants={section}>
              <DashboardHeader onRefresh={() => fetchTasks(true)} refreshing={refreshing} />
            </motion.div>
            <motion.div variants={section}>
              <DashboardCards tasks={tasks} />
            </motion.div>
            <motion.div variants={section}>
              <QuickActions />
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={section}>
                <TodayTasks tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
              </motion.div>
              <motion.div variants={section}>
                <ProductivityScore tasks={tasks} />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={section}>
                <AIRecommendation />
              </motion.div>
              <motion.div variants={section}>
                <DeadlineRisk tasks={tasks} />
              </motion.div>
            </div>
            <motion.div variants={section}>
              <RecentActivity tasks={tasks} />
            </motion.div>
          </>
        )}
      </motion.div>
    </>
  )
}

export default Dashboard
