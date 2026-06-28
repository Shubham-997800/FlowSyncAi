import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'What is FlowSync AI?',
    a: 'FlowSync AI is an AI-powered productivity platform that helps you plan, prioritize, and complete tasks before deadlines. It uses artificial intelligence to analyze your workload, create smart schedules, predict deadline risks, and provide personalized productivity insights.',
  },
  {
    q: 'How does AI prioritize tasks?',
    a: 'Our AI analyzes every task based on deadline urgency, dependencies between tasks, estimated effort, and your personal work patterns. It then assigns a priority score and arranges your day so you always work on what matters most at the right time.',
  },
  {
    q: 'Can I use it for studies?',
    a: 'Absolutely. Students use FlowSync AI to manage assignments, exam schedules, group projects, and study sessions. The AI adapts to academic timelines and helps you stay ahead of coursework without last-minute panic.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We take security seriously. Your data is encrypted in transit and at rest. We never share your personal information or task data with third parties. You can delete your account and data at any time.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-sm font-semibold text-[#111827]">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#6B7280] transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
