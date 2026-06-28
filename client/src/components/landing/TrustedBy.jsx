import { GraduationCap, Briefcase, User, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const cards = [
  { icon: GraduationCap, title: 'Students', desc: 'Manage assignments, exam prep, and group projects with AI-powered schedules.' },
  { icon: Briefcase, title: 'Professionals', desc: 'Juggle work deadlines, meetings, and personal tasks effortlessly.' },
  { icon: User, title: 'Freelancers', desc: 'Balance multiple clients and projects while hitting every deadline.' },
  { icon: Building2, title: 'Startup Teams', desc: 'Keep your team aligned and shipping on time.' },
]

function TrustedBy() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Built for Everyone
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-sm transition-shadow"
            >
              <card.icon size={24} className="text-[#2563EB] mb-4" />
              <h3 className="text-lg font-semibold text-[#111827] mb-2">{card.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedBy
