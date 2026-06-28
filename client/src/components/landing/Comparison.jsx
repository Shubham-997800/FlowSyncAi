import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

const rows = [
  { label: 'Task Reminders', traditional: true, flowsync: true },
  { label: 'Manual Planning', traditional: true, flowsync: false },
  { label: 'AI Prioritization', traditional: false, flowsync: true },
  { label: 'Smart Scheduling', traditional: false, flowsync: true },
  { label: 'Deadline Prediction', traditional: false, flowsync: true },
  { label: 'Static Task List', traditional: true, flowsync: false },
  { label: 'Personalized Insights', traditional: false, flowsync: true },
  { label: 'Focus Mode', traditional: false, flowsync: true },
]

function Comparison() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Why Choose FlowSync AI
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-[#E5E7EB] rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 bg-[#F8FAFC] border-b border-[#E5E7EB]">
            <div className="p-4 sm:p-5 text-sm font-semibold text-[#6B7280]">Feature</div>
            <div className="p-4 sm:p-5 text-sm font-semibold text-[#6B7280] text-center border-x border-[#E5E7EB]">Traditional App</div>
            <div className="p-4 sm:p-5 text-sm font-semibold text-[#2563EB] text-center">FlowSync AI</div>
          </div>
          {rows.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 ${i < rows.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
              <div className="p-4 sm:p-5 text-sm text-[#111827]">{row.label}</div>
              <div className="p-4 sm:p-5 flex items-center justify-center border-x border-[#E5E7EB]">
                {row.traditional ? (
                  <Check size={18} className="text-[#16A34A]" />
                ) : (
                  <X size={18} className="text-[#DC2626]" />
                )}
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center">
                {row.flowsync ? (
                  <Check size={18} className="text-[#16A34A]" />
                ) : (
                  <X size={18} className="text-[#DC2626]" />
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Comparison
