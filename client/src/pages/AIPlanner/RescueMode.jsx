import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'

function RescueMode({ result }) {
  if (!result.isEmergency) return null

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency Plan</h2>
      </div>

      <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-700 dark:text-red-300 font-medium mb-4">
        You only have limited time. Focus only on critical tasks.
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Critical Tasks</p>
        {result.priority.filter(t => t.level === 'High').map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <CheckCircle size={14} className="text-red-500 flex-shrink-0" />
            <span className="text-sm text-slate-900 dark:text-slate-100">{t.task}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{t.duration}</span>
          </div>
        ))}

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-4">Deferred (Ignored)</p>
        {result.priority.filter(t => t.level !== 'High').length > 0 ? (
          result.priority.filter(t => t.level !== 'High').map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 opacity-60">
              <XCircle size={14} className="text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">{t.task}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 px-3">No non-critical tasks</p>
        )}
      </div>

      <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl text-xs text-indigo-700 dark:text-indigo-300">
        Tip: Enable Focus Mode to maximize deep work during this period.
      </div>
    </div>
  )
}

export default RescueMode
