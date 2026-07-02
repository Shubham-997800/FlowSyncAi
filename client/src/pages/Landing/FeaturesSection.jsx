import { memo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Clock, AlertTriangle, Shield, Sparkles, Timer, BarChart3, Calendar, Layers, Zap } from 'lucide-react'

// Features section displaying AI capabilities in a grid of cards
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Everything You Need to Stay Productive</h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful AI features that help you complete work instead of just reminding you.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-colors">
                <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default memo(FeaturesSection)
