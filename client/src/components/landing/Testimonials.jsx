import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'SC',
    review: 'FlowSync AI completely changed how I manage my design projects. The AI scheduling helps me meet every deadline without burnout.',
    color: '#2563EB',
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    avatar: 'MJ',
    review: 'The deadline prediction feature is a lifesaver. I can now see which tasks need attention before they become urgent.',
    color: '#16A34A',
  },
  {
    name: 'Priya Patel',
    role: 'Freelance Writer',
    avatar: 'PP',
    review: 'As a freelancer juggling multiple clients, FlowSync AI keeps me organized and my clients happy. Highly recommended.',
    color: '#F59E0B',
  },
]

function Testimonials() {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-14"
        >
          Loved by Productivity Enthusiasts
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{t.review}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
