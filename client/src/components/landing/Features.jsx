import { Sparkles, Calendar, AlertTriangle, Clock, BarChart3, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Sparkles, title: 'AI Task Prioritization', desc: 'Automatically prioritizes your tasks based on deadlines, dependencies, and your work patterns.' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Generates optimized daily and weekly schedules that maximize your productivity.' },
  { icon: AlertTriangle, title: 'Deadline Prediction', desc: 'Predicts which tasks are at risk and suggests adjustments before deadlines slip.' },
  { icon: Clock, title: 'Focus Mode', desc: 'Built-in Pomodoro timer with AI-adjusted focus sessions based on your energy patterns.' },
  { icon: BarChart3, title: 'Productivity Analytics', desc: 'Detailed insights into your work patterns, completion rates, and productivity trends.' },
  { icon: Lightbulb, title: 'AI Recommendations', desc: 'Personalized suggestions to help you work smarter, not harder.' },
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
            Everything You Need To Stay Productive
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            AI-powered features designed to help you plan, focus, and deliver on time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#E5E7EB] rounded-xl p-7 hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{feature.title}</h3>
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
