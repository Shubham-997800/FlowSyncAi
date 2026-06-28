import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'What is FlowSync AI?',
    a: 'FlowSync AI is an AI-powered productivity platform that helps you plan, prioritize, and complete tasks before deadlines. It uses artificial intelligence to create smart schedules, predict deadline risks, and provide personalized productivity insights.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, FlowSync AI offers a free tier with core features including task management, AI prioritization, and basic scheduling. Premium plans unlock advanced analytics, unlimited AI suggestions, and priority support.',
  },
  {
    q: 'How does AI scheduling work?',
    a: 'Our AI analyzes your tasks, deadlines, estimated durations, and work patterns to generate an optimized daily schedule. It considers priority levels, dependencies, and your most productive hours to create a plan that maximizes your efficiency.',
  },
  {
    q: 'Can I use it for study?',
    a: 'Absolutely. Students use FlowSync AI to manage assignments, exam preparation, group projects, and study schedules. The AI adapts to academic workflows and helps you stay on top of coursework.',
  },
  {
    q: 'Can professionals use it?',
    a: 'Yes. Professionals across industries use FlowSync AI to manage work deadlines, meetings, project milestones, and personal tasks. It integrates seamlessly into professional workflows.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="bg-white border-b border-[#E5E7EB]">
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
            <div
              key={i}
              className="border border-[#E5E7EB] rounded-xl overflow-hidden"
            >
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
