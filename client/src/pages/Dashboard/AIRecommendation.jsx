import { useState, useEffect } from 'react'
import { Brain, Lightbulb, Coffee, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTasks } from '../../services/taskService'
import { prioritizeTasks } from '../../services/aiService'

function AIRecommendation() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const tasks = await getTasks()
        const active = (Array.isArray(tasks) ? tasks : []).filter(t => t.status !== 'done')
        if (active.length === 0) {
          setRecommendations([{ icon: CheckCircle2, title: 'All caught up!', desc: 'No active tasks. Create a new task to get AI suggestions.', priority: 'low', badge: 'Info' }])
          return
        }
        const res = await prioritizeTasks()
        if (res && res.rankings && res.rankings.length > 0) {
          setRecommendations(res.rankings.slice(0, 3).map((r, i) => {
            const task = active.find(t => t._id === r.taskId) || {}
            const risk = (r.riskScore || 0) > 60
            return {
              icon: i === 0 ? Lightbulb : i === 1 ? Coffee : ArrowRight,
              title: task.title || r.title || 'Untitled',
              desc: risk ? 'High risk — nearest deadline or overdue.' : r.reason ? r.reason : `Priority score: ${Math.round(r.priorityScore || 0)}%`,
              priority: risk ? 'high' : i === 0 ? 'medium' : 'low',
              badge: risk ? 'High Priority' : i === 0 ? 'Suggested' : 'Optional',
            }
          }))
        } else {
          const overdue = active.filter(t => t.deadline && new Date(t.deadline) < new Date())
          setRecommendations([
            { icon: Lightbulb, title: overdue.length > 0 ? `${overdue.length} overdue tasks` : 'Review your tasks', desc: overdue.length > 0 ? 'Focus on clearing overdue items first.' : 'You have active tasks to review.', priority: 'medium', badge: 'Active' },
          ])
        }
      } catch {
        setRecommendations([{ icon: AlertCircle, title: 'AI unavailable', desc: 'Could not fetch recommendations. Check connection.', priority: 'low', badge: 'Offline' }])
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) {
    return (
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Productivity Coach</h2>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Productivity Coach</h2>
      </div>
      <div className="space-y-3">
        {recommendations.map(({ icon: Icon, title, desc, priority, badge }) => (
          <div key={title} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
            }`}>
              <Icon size={16} className={
                priority === 'high' ? 'text-red-600 dark:text-red-400' : priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
              } />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>{badge}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AIRecommendation