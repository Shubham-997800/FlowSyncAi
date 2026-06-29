import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

function DashboardCards({ tasks }) {
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today && t.status !== 'done' })
  const completedToday = tasks.filter(t => t.status === 'done' && new Date(t.updatedAt).toISOString().split('T')[0] === today)
  const upcoming = tasks.filter(t => { if (!t.deadline || t.status === 'done') return false; const d = typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]; return d >= today })
  const totalToday = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today }).length
  const doneToday = tasks.filter(t => { const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null; return d === today && t.status === 'done' }).length
  const pct = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0

  const cards = [
    { label: "Today's Tasks", value: todayTasks.length.toString(), sub: `${completedToday.length} Completed`, icon: ListTodo, color: 'text-indigo-600 dark:text-indigo-400', to: '/tasks' },
    { label: 'Completed Today', value: completedToday.length.toString(), sub: `${pct}% Completion`, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', to: '/tasks' },
    { label: 'Upcoming Deadlines', value: upcoming.length.toString(), sub: 'Total scheduled', icon: CalendarClock, color: 'text-amber-600 dark:text-amber-400', to: '/tasks' },
    { label: 'Focus Time', value: '0h', sub: "Today's Focus", icon: Timer, color: 'text-indigo-600 dark:text-indigo-400', to: '/focus' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map(c => <StatCard key={c.label} {...c} />)}
    </div>
  )
}

export default DashboardCards
