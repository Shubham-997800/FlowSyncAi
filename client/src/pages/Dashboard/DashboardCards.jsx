import { useState, useEffect } from 'react'
import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function DashboardCards() {
  const [data, setData] = useState({ todayTasks: 0, completedToday: 0, upcomingDeadlines: 0, focusTime: '0h' })

  useEffect(() => {
    const update = () => {
      const tasks = loadTasks()
      const today = new Date().toISOString().split('T')[0]
      const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')

      const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed).length
      const completedToday = tasks.filter(t => t.completed && t.dueDate === today).length
      const upcomingDeadlines = tasks.filter(t => t.dueDate && !t.completed && t.dueDate >= today).length
      const total = tasks.filter(t => t.dueDate === today).length
      const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0

      setData({
        todayTasks,
        completedToday,
        upcomingDeadlines,
        focusTime: `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`,
        pct,
      })
    }
    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { label: "Today's Tasks", value: data.todayTasks.toString(), sub: `${data.completedToday} Completed`, icon: ListTodo, color: 'text-indigo-600 dark:text-indigo-400', to: '/tasks' },
    { label: 'Completed Today', value: data.completedToday.toString(), sub: `${data.pct}% Completion`, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', to: '/tasks' },
    { label: 'Upcoming Deadlines', value: data.upcomingDeadlines.toString(), sub: 'Total scheduled', icon: CalendarClock, color: 'text-amber-600 dark:text-amber-400', to: '/tasks' },
    { label: 'Focus Time', value: data.focusTime, sub: "Today's Focus", icon: Timer, color: 'text-indigo-600 dark:text-indigo-400', to: '/focus' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map(c => <StatCard key={c.label} {...c} />)}
    </div>
  )
}

export default DashboardCards
