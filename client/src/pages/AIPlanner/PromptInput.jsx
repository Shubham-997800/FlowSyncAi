import { useState } from 'react'
import { Sparkles, Loader2, Brain } from 'lucide-react'

const examples = [
  'I have 2 assignments and an exam tomorrow',
  '3 project deadlines this week with limited time',
  'Emergency workload — need a plan for today',
  'Prepare a study schedule for final exams',
]

function PromptInput({ onGenerate, loading }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim() || loading) return
    onGenerate(text.trim())
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <div className="p-6">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder="Describe your tasks, deadlines, or goals..."
          rows={4}
          className="w-full text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none focus:outline-none resize-none"
        />
      </div>

      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {examples.map(ex => (
          <button
            key={ex}
            onClick={() => { setText(ex); onGenerate(ex) }}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-300 disabled:opacity-50 flex items-center gap-1"
          >
            <Sparkles size={10} /> {ex}
          </button>
        ))}
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Generating AI Plan...</>
          ) : (
            <><Brain size={18} /> Generate AI Plan</>
          )}
        </button>
      </div>
    </div>
  )
}

export default PromptInput
