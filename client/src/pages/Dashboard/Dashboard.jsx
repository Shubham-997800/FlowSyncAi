import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { ListTodo, Brain, Clock, Target, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

function loadTasks() {
  try {
    const data = localStorage.getItem('flowsync_tasks')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(loadTasks)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const interval = setInterval(() => setTasks(loadTasks()), 1000)
    return () => clearInterval(interval)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed)
  const overdueTasks = tasks.filter(t => t.dueDate && !t.completed && t.dueDate < today)
  const completedToday = tasks.filter(t => t.completed && t.dueDate === today)
  const totalCompleted = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  const productivityScore = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length

  const recentTasks = [...tasks].filter(t => !t.completed).slice(0, 5)

  const stats = [
    { label: "Today's Tasks", value: todayTasks.length, sub: `${completedToday.length} completed`, icon: ListTodo, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Productivity Score', value: `${productivityScore}%`, sub: `${totalCompleted} of ${totalTasks} tasks`, icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'High Priority', value: highPriority, sub: 'tasks need attention', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Focus Hours', value: '--', sub: 'track in Focus Mode', icon: Clock, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name || 'there'}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {mounted ? (
            overdueTasks.length > 0
              ? <span className="text-red-600 dark:text-red-400 font-medium">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} — check your tasks</span>
              : todayTasks.length > 0
                ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">You have {todayTasks.length} task{todayTasks.length > 1 ? 's' : ''} due today</span>
                : 'All caught up for today!'
          ) : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition">View All <ArrowRight size={14} /></Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <CheckCircle2 size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active tasks</p>
              <Link to="/tasks" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline mt-1 inline-block">Create a task</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map(task => (
                <div key={task._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{task.title}</span>
                  {task.dueDate && <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/tasks', icon: ListTodo, label: 'Manage Tasks', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
              { to: '/ai-planner', icon: Brain, label: 'AI Planner', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
              { to: '/goals', icon: Target, label: 'View Goals', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { to: '/focus', icon: Clock, label: 'Focus Mode', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
            ].map(({ to, icon: Icon, label, color, bg }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
