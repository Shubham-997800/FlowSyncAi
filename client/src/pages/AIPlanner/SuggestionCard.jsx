import { Lightbulb } from 'lucide-react'

function SuggestionCard({ suggestions }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Lightbulb size={15} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Suggestions</h2>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900/30">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{i + 1}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestionCard
