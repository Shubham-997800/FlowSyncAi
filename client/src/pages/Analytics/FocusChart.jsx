import { Clock, Timer, TrendingUp } from 'lucide-react'

function FocusChart() {
  const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')
  const focusSessions = parseInt(localStorage.getItem('flowsync_focus_sessions') || '0')
  const avgSession = focusSessions > 0 ? Math.round(focusMinutes / focusSessions) : 0
  const bestHour = '09:00 – 12:00'

  const stats = [
    { icon: Clock, label: 'Total Focus Time', value: `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`, color: 'text-indigo-600 dark:text-indigo-400' },
    { icon: Timer, label: 'Avg Session', value: `${avgSession} min`, color: 'text-emerald-600 dark:text-emerald-400' },
    { icon: TrendingUp, label: 'Best Hours', value: bestHour, color: 'text-amber-600 dark:text-amber-400' },
  ]

  const progress = Math.min(100, Math.round((focusMinutes / 1200) * 100))

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Clock size={15} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Focus Performance</h2>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-slate-200 dark:stroke-zinc-700" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-indigo-500" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{progress}%</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">goal</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={13} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
                <p className={`text-xs font-semibold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FocusChart
