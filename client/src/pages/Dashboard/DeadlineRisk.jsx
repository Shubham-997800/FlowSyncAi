import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getTasks } from '../../services/taskService'

function DeadlineRisk() {
  const [atRisk, setAtRisk] = useState([])
  const [risk, setRisk] = useState(0)

  useEffect(() => {
    let mounted = true
    const update = async () => {
      try {
        const tasks = await getTasks()
        if (!mounted) return
        const today = new Date().toISOString().split('T')[0]
        const getDate = (t) => t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : null
        const overdue = tasks.filter(t => { const d = getDate(t); return d && t.status !== 'done' && d < today })
        const dueToday = tasks.filter(t => { const d = getDate(t); return d === today && t.status !== 'done' })

        const atRiskTasks = [...overdue, ...dueToday].slice(0, 3).map(t => ({
          name: t.title,
          remaining: getDate(t) < today ? 'Overdue' : 'Due today',
          progress: getDate(t) < today ? 100 : 65,
          action: getDate(t) < today ? 'Complete ASAP' : 'Focus now',
        }))
        setAtRisk(atRiskTasks)

        const active = tasks.filter(t => t.deadline && t.status !== 'done').length
        setRisk(active > 0 ? Math.round((atRiskTasks.length / active) * 100) : 0)
      } catch {}
    }
    update()
    const interval = setInterval(update, 10000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  const riskLevel = risk <= 25 ? 'Low Risk' : risk <= 50 ? 'Moderate Risk' : 'High Risk'
  const riskColor = risk <= 25 ? 'text-indigo-600 dark:text-indigo-400' : risk <= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
  const badgeBg = risk <= 25 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : risk <= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  const barColor = risk <= 25 ? 'bg-indigo-500' : risk <= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Deadline Risk</h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${risk}%` }} />
          </div>
          <span className={`text-sm font-bold ${riskColor}`}>{risk}%</span>
        </div>
      </div>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${badgeBg}`}>
        <AlertTriangle size={12} /> {riskLevel}
      </div>
      {atRisk.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No tasks at risk</p>
      ) : (
        <div className="space-y-3">
          {atRisk.map(({ name, remaining, progress, action }) => (
            <div key={name} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">{remaining}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-full">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Suggested: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{action}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default DeadlineRisk
