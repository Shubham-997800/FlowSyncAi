import { memo } from 'react'
import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../../components/ui/StatCard'

function getDateStr(d) {
  if (!d) return null
  if (typeof d === 'string') return d.split('T')[0]
  return new Date(d).toISOString().split('T')[0]
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
}

const DashboardCards = memo(function DashboardCards({ tasks }) {
  const today = new Date().toISOString().split('T')[0]

  const todayTaskCount = tasks.filter(t => { const d = getDateStr(t.deadline); return d === today && t.status !== 'done' }).length
  const completedTodayCount = tasks.filter(t => t.status === 'done' && getDateStr(t.updatedAt) === today).length
  const upcomingCount = tasks.filter(t => { if (!t.deadline || t.status === 'done') return false; return getDateStr(t.deadline) >= today }).length
  const totalToday = tasks.filter(t => getDateStr(t.deadline) === today).length
  const doneToday = tasks.filter(t => getDateStr(t.deadline) === today && t.status === 'done').length
  const pct = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0

  const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')
  const focusSessions = parseInt(localStorage.getItem('flowsync_focus_sessions') || '0')
  const focusHours = Math.floor(focusMinutes / 60)
  const focusMins = focusMinutes % 60
  const focusStr = focusMinutes > 0 ? `${focusHours > 0 ? `${focusHours}h ` : ''}${focusMins}m` : '—'

  const cards = [
    { label: "Today's Tasks", value: todayTaskCount.toString(), sub: `${completedTodayCount} Completed`, icon: ListTodo, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', to: '/tasks' },
    { label: 'Completed Today', value: completedTodayCount.toString(), sub: `${pct}% Completion`, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', to: '/tasks' },
    { label: 'Upcoming Deadlines', value: upcomingCount.toString(), sub: 'Total scheduled', icon: CalendarClock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', to: '/tasks' },
    { label: 'Focus Time', value: focusStr, sub: `${focusSessions} Session${focusSessions !== 1 ? 's' : ''}`, icon: Timer, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', to: '/focus' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <motion.div key={c.label} variants={cardVariant} initial="hidden" animate="show" custom={i}>
          <StatCard {...c} />
        </motion.div>
      ))}
    </div>
  )
})

export default DashboardCards
