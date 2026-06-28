import { Brain, Clock, AlertTriangle, Shield, Sparkles, Timer, BarChart3, Calendar, Layers, Zap } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI Task Prioritization', desc: 'Automatically rank tasks by urgency, importance, and deadline proximity so you always know what to work on next.' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Let AI build your optimal daily schedule based on energy patterns, meeting slots, and task dependencies.' },
  { icon: AlertTriangle, title: 'Deadline Risk Prediction', desc: 'Get early warnings when tasks are at risk so you can adjust priorities before deadlines slip.' },
  { icon: Shield, title: 'Emergency Rescue Mode', desc: 'When you fall behind, AI instantly replans your remaining work to minimize damage and recover fast.' },
  { icon: Sparkles, title: 'AI Productivity Coach', desc: 'Receive personalized tips and patterns from AI that analyzes your work habits over time.' },
  { icon: Timer, title: 'Focus Timer', desc: 'AI-adjusted Pomodoro sessions that adapt break timing based on your focus levels and task complexity.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track completion rates, productivity trends, and bottleneck patterns with visual reports.' },
  { icon: Calendar, title: 'Calendar Planning', desc: 'Sync with your calendar and let AI block focus time around existing meetings and commitments.' },
  { icon: Layers, title: 'Task Breakdown', desc: 'AI splits complex tasks into manageable subtasks with estimated durations and logical ordering.' },
  { icon: Zap, title: 'Personalized Recommendations', desc: 'Get suggestions tuned to your work style, productivity patterns, and past behavior.' },
]

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Everything You Need to Stay Productive</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful AI features that help you complete work instead of just reminding you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition">
                <Icon size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
