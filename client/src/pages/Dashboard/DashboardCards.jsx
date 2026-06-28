import { useState, useEffect } from 'react'
import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { getTasks } from '../../services/taskService'

function DashboardCards() {
  const [data, setData] = useState({ todayTasks: 0, completedToday: 0, upcomingDeadlines: 0, focusTime: '0h', pct: 0 })

  useEffect(() => {
    let mounted = true
    const update = async () => {
      try {
        const tasks = await getTasks()
        if (!mounted) return
        const today = new Date().toISOString().split('T')[0]
        const todayTasks = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today && t.status !== 'done' })
        const completedToday = tasks.filter(t => t.status === 'done' && new Date(t.updatedAt).toISOString().split('T')[0] === today)
        const upcoming = tasks.filter(t => { if (!t.deadline || t.status === 'done') return false; const d = typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]; return d >= today })
        const total = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today }).length
        const doneToday = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today && t.status === 'done' }).length
        const pct = total > 0 ? Math.round((doneToday / total) * 100) : 0
        setData({ todayTasks: todayTasks.length, completedToday: completedToday.length, upcomingDeadlines: upcoming.length, focusTime: '0h', pct })
      } catch {}
    }
    update()
    const interval = setInterval(update, 10000)
    return () => { mounted = false; clearInterval(interval) }
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
