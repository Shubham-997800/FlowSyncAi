import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, ListTodo, Clock, Target, AlertTriangle, Flame, Brain } from 'lucide-react'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function loadGoalData() {
  try { const d = localStorage.getItem('flowsync_goals'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function loadHabitData() {
  try { const d = localStorage.getItem('flowsync_habits'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function Analytics() {
  const [tasks, setTasks] = useState(loadTasks)
  const [goals] = useState(loadGoalData)
  const [habits] = useState(loadHabitData)

  useEffect(() => {
    const interval = setInterval(() => setTasks(loadTasks()), 2000)
    return () => clearInterval(interval)
  }, [])

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  const highPriority = tasks.filter(t => t.priority === 'high').length
  const highCompleted = tasks.filter(t => t.priority === 'high' && t.completed).length
  const overdue = tasks.filter(t => t.dueDate && !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length
  const todayTasks = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length
  const todayDone = tasks.filter(t => t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length
  const focusSessions = localStorage.getItem('flowsync_focus_sessions') || '0'
  const totalGoals = goals.length
  const avgGoalProgress = totalGoals > 0 ? Math.round(goals.reduce((s, g) => s + (g.progress || 0), 0) / totalGoals) : 0
  const habitStreaks = habits.filter(h => (h.streak || 0) >= 3).length

  const priorityData = [
    { label: 'High', total: highPriority, done: highCompleted, color: 'bg-red-500' },
    { label: 'Medium', total: tasks.filter(t => t.priority === 'medium').length, done: tasks.filter(t => t.priority === 'medium' && t.completed).length, color: 'bg-amber-400' },
    { label: 'Low', total: tasks.filter(t => t.priority === 'low').length, done: tasks.filter(t => t.priority === 'low' && t.completed).length, color: 'bg-emerald-400' },
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekData = weekDays.map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    return tasks.filter(t => t.completed && t.dueDate === dateStr).length
  })
  const maxVal = Math.max(...weekData, 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your productivity at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'Completion Rate', value: `${completionRate}%`, sub: `${completed}/${total} tasks`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { icon: ListTodo, label: 'Today', value: `${todayDone}/${todayTasks}`, sub: 'tasks done today', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { icon: Clock, label: 'Focus Sessions', value: focusSessions, sub: 'total sessions', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { icon: AlertTriangle, label: 'Overdue', value: overdue, sub: 'tasks past deadline', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
          { icon: Target, label: 'Goals', value: `${totalGoals}`, sub: `${avgGoalProgress}% avg progress`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { icon: Flame, label: 'Habit Streaks', value: habitStreaks, sub: 'habits with 3+ day streak', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { icon: Brain, label: 'AI Score', value: '--', sub: 'coming soon', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { icon: BarChart3, label: 'Productivity', value: completionRate >= 70 ? 'Great' : completionRate >= 40 ? 'Good' : 'Needs Work', sub: 'overall rating', color: completionRate >= 70 ? 'text-emerald-600' : completionRate >= 40 ? 'text-amber-600' : 'text-red-600', bg: 'bg-gray-100 dark:bg-gray-700' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}><Icon size={16} className={color} /></div>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Completion by Priority</h2>
          <div className="space-y-4">
            {priorityData.map(({ label, total, done, color }) => {
              const rate = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="text-gray-500 dark:text-gray-400">{done}/{total} ({rate}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${rate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Completion</h2>
          <div className="flex items-end gap-2 h-40 pt-4">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">{val}</span>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-1 self-end" style={{ height: '100%' }}>
                  <div className="bg-emerald-500 rounded-lg transition-all self-end" style={{ height: `${(val / maxVal) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {total === 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center text-gray-400 dark:text-gray-500">
          <BarChart3 size={36} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Add some tasks to see your analytics</p>
        </div>
      )}
    </div>
  )
}

export default Analytics
