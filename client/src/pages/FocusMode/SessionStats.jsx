import { Brain, Timer, Coffee, TrendingUp } from 'lucide-react'

function SessionStats({ sessions, totalMinutes, mode }) {
  const stats = [
    { icon: Timer, label: 'Sessions', value: sessions.toString(), sub: 'completed', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { icon: Brain, label: 'Focus Time', value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, sub: 'total focus', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: Coffee, label: 'Mode', value: mode === 'focus' ? 'Focus' : 'Break', sub: 'current mode', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { icon: TrendingUp, label: 'Score', value: sessions > 0 ? `${Math.min(100, sessions * 15 + 20)}` : '--', sub: 'productivity', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Session Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={13} className={color} />
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
            </div>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionStats
