import { useState, useEffect, useCallback } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardCards from './DashboardCards'
import QuickActions from './QuickActions'
import ProductivityScore from './ProductivityScore'
import AIRecommendation from './AIRecommendation'
import DeadlineRisk from './DeadlineRisk'
import TodayTasks from './TodayTasks'
import RecentActivity from './RecentActivity'
import { getTasks, updateTask, deleteTask } from '../../services/taskService'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const data = await getTasks()
        if (mounted) setTasks(Array.isArray(data) ? data : [])
      } catch { /* ignore */ }
      if (mounted) setLoading(false)
    }
    fetch()
    return () => { mounted = false }
  }, [])

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
    <div className="max-w-7xl mx-auto space-y-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900/40 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <DashboardHeader />
          <DashboardCards tasks={tasks} />
          <QuickActions />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodayTasks tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
            <ProductivityScore tasks={tasks} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIRecommendation />
            <DeadlineRisk tasks={tasks} />
          </div>
          <RecentActivity tasks={tasks} />
        </>
      )}
    </div>
  )
}

export default Dashboard
