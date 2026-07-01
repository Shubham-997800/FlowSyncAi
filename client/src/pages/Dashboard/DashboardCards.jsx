import { useState, useEffect, memo } from 'react'
import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../../components/ui/StatCard'

function getDateStr(d) {
  if (!d) return null
  if (typeof d === 'string') return d.split('T')[0]
  return new Date(d).toISOString().split('T')[0]
}

function AnimatedNumber({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    const start = performance.now()
    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <>{display}</>
}

function Sparkline({ data, className = 'text-indigo-500' }) {
  if (!data || data.length < 2) return null
  const w = 80, h = 24
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  const color = data[data.length - 1] >= data[0] ? 'stroke-indigo-500' : 'stroke-red-400'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={`flex-shrink-0 ${className}`}>
      <polyline fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={color}
        points={points}
      />
    </svg>
  )
}

function calcTrend(dailyCounts) {
  if (!dailyCounts || dailyCounts.length < 7) return null
  const firstHalf = dailyCounts.slice(0, 3).reduce((a, b) => a + b, 0)
  const secondHalf = dailyCounts.slice(-3).reduce((a, b) => a + b, 0)
  if (firstHalf === 0 && secondHalf === 0) return null
  if (firstHalf === 0) return { direction: 'up', value: 100 }
  const change = Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
  if (change === 0) return null
  return { direction: change > 0 ? 'up' : 'down', value: Math.abs(change) }
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
}

const DashboardCards = memo(function DashboardCards({ tasks }) {
  const today = new Date().toISOString().split('T')[0]
  const [dailyCounts, setDailyCounts] = useState([])

  useEffect(() => {
    const counts = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      const done = tasks.filter(t => t.status === 'done' && getDateStr(t.updatedAt) === ds).length
      counts.push(done)
    }
    setDailyCounts(counts)
  }, [tasks])

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

  const trend = calcTrend(dailyCounts)

  const cards = [
    {
      label: "Today's Tasks", value: todayTaskCount, sub: `${completedTodayCount} Completed`, icon: ListTodo,
      color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', to: '/tasks',
      trend: trend ? { ...trend, label: 'tasks (3d vs 3d ago)' } : null,
    },
    {
      label: 'Completed Today', value: completedTodayCount, sub: `${pct}% Completion`, icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', to: '/tasks',
      trend: null,
      sparkline: dailyCounts,
    },
    {
      label: 'Upcoming Deadlines', value: upcomingCount, sub: 'Total scheduled', icon: CalendarClock,
      color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', to: '/tasks',
    },
    {
      label: 'Focus Time', value: focusStr, sub: `${focusSessions} Session${focusSessions !== 1 ? 's' : ''}`, icon: Timer,
      color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', to: '/focus',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <motion.div key={c.label} variants={cardVariant} initial="hidden" animate="show" custom={i}>
          <StatCard
            label={c.label}
            value={typeof c.value === 'number' ? <AnimatedNumber value={c.value} /> : c.value}
            sub={c.sub}
            icon={c.icon}
            color={c.color}
            bg={c.bg}
            to={c.to}
            trend={c.trend}
            sparkline={c.sparkline}
          />
        </motion.div>
      ))}
    </div>
  )
})

export default DashboardCards
