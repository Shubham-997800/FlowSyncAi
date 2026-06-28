import { AlertTriangle } from 'lucide-react'

const atRiskTasks = [
  { name: 'Q4 Report', remaining: '2h 30m', progress: 65, action: 'Focus now' },
  { name: 'API Docs', remaining: '4h', progress: 30, action: 'Start immediately' },
]

function DeadlineRisk() {
  const risk = 22
  const riskLevel = risk <= 25 ? 'Low Risk' : risk <= 50 ? 'Moderate Risk' : 'High Risk'
  const riskColor = risk <= 25 ? 'text-emerald-600 dark:text-emerald-400' : risk <= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
  const badgeBg = risk <= 25 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : risk <= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  const barColor = risk <= 25 ? 'bg-emerald-500' : risk <= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Deadline Risk</h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
          <div key={name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">{remaining}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Suggested: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{action}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DeadlineRisk
