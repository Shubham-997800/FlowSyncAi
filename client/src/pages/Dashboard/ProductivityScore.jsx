import { useEffect, useState } from 'react'

const weeklyData = [65, 72, 80, 75, 92, 88, 85]

function ProductivityScore() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setScore(92), 200)
    return () => clearTimeout(timer)
  }, [])

  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

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
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{score}%</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Excellent</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Completed <strong className="text-slate-900 dark:text-slate-100">46</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-700" />
            <span className="text-slate-500 dark:text-slate-400">Pending <strong className="text-slate-900 dark:text-slate-100">4</strong></span>
          </div>
        </div>
        <div className="mt-5 w-full">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Weekly Trend</p>
          <div className="flex items-end gap-1.5 h-12">
            {weeklyData.map((val, i) => (
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
