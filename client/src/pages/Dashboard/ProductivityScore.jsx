import { useEffect, useState } from 'react'

const weeklyData = [65, 72, 80, 75, 92, 88, 85]

function ProductivityScore() {
  const [score, setScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setScore(92), 200)
    return () => clearTimeout(timer)
  }, [])

  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productivity Score</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="8" />
            <circle
              cx="55" cy="55" r={radius} fill="none"
              className="stroke-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? offset : circumference}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mounted ? score : 0}%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Excellent</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">Completed <strong className="text-gray-900 dark:text-white">46</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-gray-600 dark:text-gray-400">Pending <strong className="text-gray-900 dark:text-white">4</strong></span>
          </div>
        </div>
        <div className="mt-5 w-full">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Weekly Trend</p>
          <div className="flex items-end gap-1.5 h-12">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded bg-emerald-400 dark:bg-emerald-500 transition-all duration-500"
                  style={{ height: mounted ? `${(val / 100) * 48}px` : '0px' }}
                />
                <span className="text-[9px] text-gray-400 dark:text-gray-500">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductivityScore
