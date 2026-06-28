import { AlertTriangle, Shield } from 'lucide-react'

const levelConfig = {
  High: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', bar: 'bg-red-500' },
  Medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', bar: 'bg-amber-500' },
  Low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', bar: 'bg-emerald-500' },
}

function PriorityCard({ tasks }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={15} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Priority Analysis</h2>
      </div>

      <div className="space-y-4">
        {tasks.map((t, i) => {
          const cfg = levelConfig[t.level] || levelConfig.Low
          return (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{t.level}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t.duration}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{t.task}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.reason}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Shield size={12} /> Risk
                </div>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className={`${cfg.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${t.risk}%` }} />
                </div>
                <span className={`text-xs font-bold ${cfg.color}`}>{t.risk}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriorityCard
