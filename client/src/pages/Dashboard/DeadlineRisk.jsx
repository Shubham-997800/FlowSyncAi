import { AlertTriangle } from 'lucide-react'

const atRiskTasks = [
  { name: 'Q4 Report', remaining: '2h 30m', progress: 65, action: 'Focus now' },
  { name: 'API Docs', remaining: '4h', progress: 30, action: 'Start immediately' },
]

function DeadlineRisk() {
  const risk = 22
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
      <div className="space-y-3">
        {atRiskTasks.map(({ name, remaining, progress, action }) => (
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
    </section>
  )
}

export default DeadlineRisk
