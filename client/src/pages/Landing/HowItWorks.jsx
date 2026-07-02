import { memo } from 'react'
import { motion } from 'framer-motion'
import { PenSquare, Brain, Calendar, CheckCircle, Clock, Target, Shield, ArrowRight } from 'lucide-react'

// How-It-Works section showing 4-step process and benefit cards
const steps = [
  { icon: PenSquare, title: 'Create Your Tasks', desc: 'Add tasks naturally — AI reads deadlines, priority, and dependencies automatically.' },
  { icon: Brain, title: 'AI Understands Priority', desc: 'Our engine analyzes urgency, workload, and risk to rank what matters most.' },
  { icon: Calendar, title: 'AI Builds Your Schedule', desc: 'An optimized plan is generated around your meetings, energy, and focus time.' },
  { icon: CheckCircle, title: 'Complete Before Deadlines', desc: 'Track progress, adjust on the fly, and never miss another deadline.' },
]

const benefits = [
  { icon: Clock, title: 'Save Time', desc: 'Stop deciding what to do. AI plans your day so you can focus on execution.' },
  { icon: Target, title: 'Stay Focused', desc: 'Eliminate context switching with timed focus blocks tailored to your workload.' },
  { icon: Shield, title: 'Never Miss Deadlines', desc: 'Early risk alerts and smart replanning keep every deadline within reach.' },
]

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' },
  }),
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">How FlowSync AI Works</h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Four simple steps from task creation to deadline mastery.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 dark:bg-zinc-800" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-5 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-colors">
                  <Icon size={28} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute top-6 -left-4 w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white text-sm font-bold flex items-center justify-center z-20 shadow-sm">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{desc}</p>

                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="hidden lg:block absolute -right-5 top-8 text-slate-300 dark:text-zinc-700" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-24 grid md:grid-cols-3 gap-6"
        >
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
                <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default memo(HowItWorks)
