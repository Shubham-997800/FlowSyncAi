import { memo } from 'react'
import { CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Shows recent task completions and creations grouped by time
const activityVariant = {
  hidden: { opacity: 0, x: -12 },
  show: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.08 } }),
}

function getGroupLabel(time) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() - now.getDay())

  if (time >= today) return 'Today'
  if (time >= yesterday) return 'Yesterday'
  if (time >= weekStart) return 'This Week'
  return null
}

const RecentActivity = memo(function RecentActivity({ tasks }) {
  const navigate = useNavigate()

  const activities = tasks
    .filter(t => t.status === 'done' || new Date(t.createdAt) > new Date(Date.now() - 7 * 86400000))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 10)
    .map(t => ({
      id: t._id,
      text: t.status === 'done' ? `"${t.title}" completed` : `"${t.title}" created`,
      type: t.status === 'done' ? 'completed' : 'added',
      time: new Date(t.status === 'done' ? (t.updatedAt || t.createdAt) : t.createdAt),
    }))

  const grouped = activities.reduce((acc, a) => {
    const label = getGroupLabel(a.time)
    if (label) {
      if (!acc[label]) acc[label] = []
      acc[label].push(a)
    }
    return acc
  }, {})

  const groupOrder = ['Today', 'Yesterday', 'This Week']

  const getIcon = (type) => {
    if (type === 'completed') return { icon: CheckCircle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' }
    return { icon: Plus, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' }
  }

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
        <button onClick={() => navigate('/tasks')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </button>
      </div>
      {activities.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No recent activity</motion.p>
      ) : (
        <div className="relative pl-6 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-700">
          {groupOrder.map(group => {
            if (!grouped[group]) return null
            return (
              <div key={group} className="mb-4 last:mb-0">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{group}</p>
                {grouped[group].map((a, i) => {
                  const { icon: Icon, color, bg } = getIcon(a.type)
                  return (
                    <motion.div
                      key={a.id}
                      variants={activityVariant}
                      initial="hidden"
                      animate="show"
                      custom={i}
                      className="relative pb-3 last:pb-0 cursor-pointer hover:opacity-80 transition"
                      onClick={() => navigate('/tasks')}
                    >
                      <div className={`absolute -left-[18px] w-5 h-5 rounded-full ${bg} flex items-center justify-center ring-2 ring-white dark:ring-zinc-900`}>
                        <Icon size={10} className={color} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{a.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {a.time ? a.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
})

export default RecentActivity
