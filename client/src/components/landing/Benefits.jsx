import { TrendingUp, Clock, Heart, CheckCircle2, Target, CalendarCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  { icon: TrendingUp, title: 'Better Productivity', desc: 'Focus on high-impact work with AI-guided prioritization.' },
  { icon: Clock, title: 'Save Time', desc: 'Stop deciding what to do next. Let AI plan your day.' },
  { icon: Heart, title: 'Reduce Stress', desc: 'Never worry about forgotten deadlines again.' },
  { icon: CheckCircle2, title: 'Complete More Tasks', desc: 'Finish more work with optimized daily schedules.' },
  { icon: Target, title: 'Improve Focus', desc: 'AI-timed focus sessions keep you in the zone.' },
  { icon: CalendarCheck, title: 'Never Miss Deadlines', desc: 'Predict risks early and adjust before it matters.' },
]

function Benefits() {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Built for Results
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#111827] mb-1">{b.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Benefits
