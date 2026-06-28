import { Bot, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function AISection() {
  return (
    <section id="ai" className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Your Personal AI Productivity Coach
          </h2>
          <p className="text-lg text-[#6B7280] max-w-xl mx-auto">
            Talk to FlowSync AI like a teammate. It understands your workload and builds your plan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#E5E7EB] bg-white">
              <Bot size={16} className="text-[#2563EB]" />
              <span className="text-sm font-semibold text-[#111827]">FlowSync AI</span>
              <span className="ml-auto text-xs text-[#6B7280]">Online</span>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-start">
                <div className="bg-[#EFF6FF] text-sm text-[#111827] rounded-2xl rounded-tl-sm px-5 py-3 max-w-[80%]">
                  I have two assignments due Friday and a job interview on Wednesday. What should I do?
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-[#2563EB] text-sm text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] space-y-2">
                  {[
                    'Prioritized your interview prep for Wednesday',
                    'Scheduled Assignment A for Monday morning',
                    'Flagged Assignment B as at risk — suggested Tuesday afternoon',
                    'Blocked 30 min daily for interview practice',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-white flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-[#E5E7EB] pt-4">
                <div className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280]">
                  Tell FlowSync AI about your week...
                </div>
                <button className="bg-[#2563EB] text-white p-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AISection
