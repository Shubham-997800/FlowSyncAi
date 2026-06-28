import { FileText, Brain, Calendar, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  { icon: FileText, title: 'Create Tasks', desc: 'Add your tasks, deadlines, and estimated time.' },
  { icon: Brain, title: 'AI Understands Priorities', desc: 'Our AI analyzes urgency, dependencies, and your habits.' },
  { icon: Calendar, title: 'AI Generates Smart Schedule', desc: 'Get an optimized daily plan tailored to you.' },
  { icon: CheckCircle2, title: 'Complete Tasks On Time', desc: 'Focus on what matters with AI-powered guidance.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px border-t border-dashed border-[#E5E7EB]" />
                )}
                <div className="w-16 h-16 rounded-xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} className="text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B7280]">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="flex justify-center gap-2 mt-12 lg:hidden">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < steps.length - 1 ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
