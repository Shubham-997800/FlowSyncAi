import { Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Solution() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} />
            Meet FlowSync AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-6">
            FlowSync AI doesn't just remind you.
            <span className="block text-[#2563EB]">It actively helps you complete your work.</span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-10">
            While traditional apps leave you guessing, FlowSync AI analyzes your workload,
            intelligently prioritizes every task, builds a personalized daily schedule, and
            adapts in real-time as things change. You stop planning and start doing.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            {[
              { label: 'Tasks Analyzed', value: 'AI scans deadlines, dependencies, and effort' },
              { label: 'Schedule Built', value: 'Personalized daily plan in seconds' },
              { label: 'Progress Tracked', value: 'Real-time adapts to your pace' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="border border-[#E5E7EB] rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight size={14} className="text-[#2563EB]" />
                  <span className="text-sm font-semibold text-[#111827]">{item.label}</span>
                </div>
                <p className="text-xs text-[#6B7280]">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Solution
