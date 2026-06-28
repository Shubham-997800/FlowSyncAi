import { Bell, List, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const problems = [
  { icon: Bell, title: 'Passive Reminders', desc: 'Traditional apps just notify you. They never help you figure out what to work on first.' },
  { icon: List, title: 'No Prioritization', desc: 'Every task looks equally important. You waste time deciding what to do next.' },
  { icon: AlertCircle, title: 'No Execution Guidance', desc: 'Knowing what to do is not enough. You need a plan that adapts to your workload.' },
]

function Problem() {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Why Traditional To-Do Apps Fail
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#DC2626]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{p.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Problem
