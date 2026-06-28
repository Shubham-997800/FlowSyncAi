import { useState, useEffect } from 'react'
import { CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function RecentActivity() {
  const [activities, setActivities] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('flowsync_tasks') || '[]')
        const recent = tasks
          .filter(t => t.completed || t.dueDate)
          .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
          .slice(0, 5)
          .map(t => ({
            id: t._id,
            text: t.completed ? `"${t.title}" completed` : `"${t.title}" scheduled`,
            type: t.completed ? 'completed' : 'added',
            time: t.completed ? new Date(t.dueDate || t.createdAt) : new Date(t.createdAt || t.dueDate),
          }))
        setActivities(recent)
      } catch { /* ignore */ }
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

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
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No recent activity</p>
      ) : (
        <div className="relative pl-6 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-700">
          {activities.map((a) => {
            const { icon: Icon, color, bg } = getIcon(a.type)
            return (
              <div key={a.id} className="relative pb-5 last:pb-0">
                <div className={`absolute -left-[18px] w-5 h-5 rounded-full ${bg} flex items-center justify-center ring-2 ring-white dark:ring-zinc-900`}>
                  <Icon size={10} className={color} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{a.text}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {a.time ? a.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default RecentActivity
