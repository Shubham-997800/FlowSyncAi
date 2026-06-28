import { Brain, Lightbulb, Coffee, ArrowRight } from 'lucide-react'

const recommendations = [
  { icon: Lightbulb, title: 'Finish Database Assignment', desc: 'Complete before 5 PM — nearest deadline.', priority: 'high', badge: 'High Priority' },
  { icon: Coffee, title: 'Take a 15-min Break', desc: 'Pause after current task to maintain focus.', priority: 'medium', badge: 'Suggested' },
  { icon: ArrowRight, title: 'Reschedule Design Task', desc: 'Move to tomorrow to balance workload.', priority: 'low', badge: 'Optional' },
]

function AIRecommendation() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
          <Brain size={15} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Productivity Coach</h2>
      </div>
      <div className="space-y-3">
        {recommendations.map(({ icon: Icon, title, desc, priority, badge }) => (
          <div
            key={title}
            className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              <Icon size={16} className={
                priority === 'high' ? 'text-red-600 dark:text-red-400' : priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              } />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                }`}>{badge}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AIRecommendation
