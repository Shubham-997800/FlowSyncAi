import { useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { motion } from 'framer-motion'

function CTA() {
  const navigate = useNavigate()

  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4"
        >
          Ready to Take Control of Your Time?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#6B7280] mb-10 max-w-xl mx-auto"
        >
          Let AI plan your day while you focus on what matters.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => navigate('/register')}
            className="bg-[#2563EB] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1d4ed8] transition-colors"
          >
            Start Free
          </button>
          <a
            href="https://github.com/Shubham-997800/FlowSync-Ai"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#E5E7EB] text-[#111827] text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-[#F8FAFC] transition-colors inline-flex items-center gap-2"
          >
            <GitBranch size={18} />
            View GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
