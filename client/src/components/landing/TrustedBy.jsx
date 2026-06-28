import { motion } from 'framer-motion'

const logos = [
  { name: 'Vercel', color: '#111827' },
  { name: 'Linear', color: '#5E6AD2' },
  { name: 'Raycast', color: '#FF6363' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'Notion', color: '#111827' },
  { name: 'Figma', color: '#1E1E1E' },
]

function TrustedBy() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-xs font-semibold text-[#6B7280] text-center tracking-widest uppercase mb-10">
          Trusted Productivity Experience
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-lg font-bold tracking-tight opacity-40 hover:opacity-60 transition-opacity"
              style={{ color: logo.color }}
            >
              {logo.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedBy
