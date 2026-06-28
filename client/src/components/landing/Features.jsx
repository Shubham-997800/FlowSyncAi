import { Sparkles, Calendar, AlertTriangle, Clock, BarChart3, Lightbulb, Shield, Layers, Target, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Sparkles, title: 'AI Task Prioritization', desc: 'Automatically ranks your tasks by urgency, dependencies, and your work patterns.' },
  { icon: Calendar, title: 'AI Smart Scheduler', desc: 'Generates optimized daily schedules that fit your energy levels and commitments.' },
  { icon: AlertTriangle, title: 'Deadline Risk Prediction', desc: 'Identifies tasks at risk of missing deadlines and suggests early adjustments.' },
  { icon: Clock, title: 'Focus Mode', desc: 'Built-in Pomodoro timer with AI-adjusted focus sessions for deep work.' },
  { icon: Shield, title: 'Emergency Rescue Mode', desc: 'When deadlines pile up, AI reorganizes everything to help you catch up fast.' },
  { icon: Lightbulb, title: 'AI Productivity Coach', desc: 'Personalized advice on how to improve your workflow and build better habits.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track completion rates, focus hours, and productivity trends over time.' },
  { icon: Layers, title: 'Calendar Planning', desc: 'Visual calendar with AI-suggested time blocks for every task.' },
  { icon: Target, title: 'Task Breakdown', desc: 'AI splits large tasks into manageable subtasks with estimated time.' },
  { icon: RefreshCw, title: 'Personalized Recommendations', desc: 'Learns your habits and suggests the best times for specific types of work.' },
]

function Features() {
  return (
    <section id="features" className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Everything You Need To Stay Ahead
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Intelligent features designed to help you plan, focus, and deliver every time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">{feature.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
