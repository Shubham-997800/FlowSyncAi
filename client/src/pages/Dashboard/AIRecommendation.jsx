import { Brain, Lightbulb, Coffee, ArrowRight } from 'lucide-react'

const recommendations = [
  { icon: Lightbulb, title: 'Finish Database Assignment', desc: 'Complete before 5 PM — nearest deadline.', priority: 'high', badge: 'High Priority' },
  { icon: Coffee, title: 'Take a 15-min Break', desc: 'Pause after current task to maintain focus.', priority: 'medium', badge: 'Suggested' },
  { icon: ArrowRight, title: 'Reschedule Design Task', desc: 'Move to tomorrow to balance workload.', priority: 'low', badge: 'Optional' },
]

function AIRecommendation() {
  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Productivity Coach</h2>
      </div>
      <div className="space-y-3">
        {recommendations.map(({ icon: Icon, title, desc, priority, badge }) => (
          <div key={title} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
            }`}>
              <Icon size={16} className={
                priority === 'high' ? 'text-red-600 dark:text-red-400' : priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
              } />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>{badge}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AIRecommendation
