import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'

function Sparkline({ data }) {
  if (!data || data.length < 2) return null
  const w = 64, h = 20
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  const color = data[data.length - 1] >= data[0] ? 'stroke-indigo-500' : 'stroke-red-400'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0 opacity-70">
      <polyline fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className={color}
        points={points}
      />
    </svg>
  )
}

function StatCard({ label, value, sub, icon: Icon, color, bg, to, trend, sparkline }) {
  const content = (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon size={16} className={color} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
        {sparkline && <Sparkline data={sparkline} />}
      </div>
    </div>
  )

  if (to) return <Link to={to}>{content}</Link>
  return content
}

export default StatCard
