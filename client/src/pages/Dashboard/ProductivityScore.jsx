import { useEffect, useState } from 'react'
import { getTasks } from '../../services/taskService'

function ProductivityScore() {
  const [data, setData] = useState({ completed: 0, pending: 0, score: 0, weeklyData: [0,0,0,0,0,0,0] })
  const [animateScore, setAnimateScore] = useState(0)

  useEffect(() => {
    let mounted = true
    const update = async () => {
      try {
        const tasks = await getTasks()
        if (!mounted) return
        const completed = tasks.filter(t => t.status === 'done').length
        const pending = tasks.filter(t => t.status !== 'done').length
        const total = tasks.length
        const score = total > 0 ? Math.round((completed / total) * 100) : 0

        const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        const weeklyData = dayNames.map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dateStr = d.toISOString().split('T')[0]
          const dayTasks = tasks.filter(t => { if (!t.deadline) return false; const dd = typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]; return dd === dateStr })
          return dayTasks.length > 0 ? Math.round((dayTasks.filter(t => t.status === 'done').length / dayTasks.length) * 100) : 0
        })

        setData({ completed, pending, score, weeklyData })
      } catch {}
    }
    update()
    const interval = setInterval(update, 10000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(data.score), 200)
    return () => clearTimeout(timer)
  }, [data.score])

  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animateScore / 100) * circumference

  const getLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Needs Work' : 'Start Tracking'

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Productivity Score</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" className="stroke-slate-200 dark:stroke-zinc-700" strokeWidth="8" />
            <circle cx="55" cy="55" r={radius} fill="none" className="stroke-indigo-500 transition-all duration-1000 ease-out" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{animateScore}%</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{getLabel(animateScore)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Completed <strong className="text-slate-900 dark:text-slate-100">{data.completed}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-700" />
            <span className="text-slate-500 dark:text-slate-400">Pending <strong className="text-slate-900 dark:text-slate-100">{data.pending}</strong></span>
          </div>
        </div>
        <div className="mt-5 w-full">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Weekly Trend</p>
          <div className="flex items-end gap-1.5 h-12">
            {data.weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded bg-indigo-500 transition-all duration-500" style={{ height: `${(val / 100) * 48}px` }} />
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductivityScore
