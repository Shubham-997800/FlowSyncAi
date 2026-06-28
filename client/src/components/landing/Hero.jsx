import { useNavigate } from 'react-router-dom'
import { Play, Check, Sparkles, Clock, AlertTriangle, Target, Brain, Timer } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <Sparkles size={14} />
              AI Productivity Companion
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-[1.08] tracking-tight mb-6">
              Never Miss a Deadline Again.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-[#6B7280] leading-relaxed mb-8 max-w-lg">
              FlowSync AI intelligently prioritizes your tasks, creates personalized schedules, predicts deadline risks, and helps you complete work before it's too late.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#2563EB] text-white text-sm font-semibold px-7 py-3 rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Get Started
              </button>
              <button className="border border-[#E5E7EB] text-[#111827] text-sm font-semibold px-7 py-3 rounded-lg hover:bg-[#F8FAFC] transition-colors inline-flex items-center gap-2">
                <Play size={16} /> Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="text-sm text-[#6B7280]">
              No credit card required
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                <span className="ml-3 text-xs text-[#6B7280] font-medium">Dashboard</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#111827]">Today's Schedule</h3>
                  <span className="text-xs text-[#6B7280]">3 tasks remaining</span>
                </div>

                <div className="space-y-2">
                  {[
                    { title: 'Design Review', time: '9:00 AM', priority: 'High', color: '#DC2626' },
                    { title: 'API Integration', time: '11:30 AM', priority: 'Medium', color: '#F59E0B' },
                    { title: 'Team Sync', time: '2:00 PM', priority: 'Low', color: '#16A34A' },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-white">
                      <div className="w-4 h-4 rounded border-2 border-[#E5E7EB] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827] truncate">{task.title}</p>
                        <p className="text-xs text-[#6B7280]">{task.time}</p>
                      </div>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${task.color}15`, color: task.color }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg border border-[#E5E7EB] bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-[#2563EB]" />
                      <span className="text-xs text-[#6B7280]">Productivity</span>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">87%</p>
                    <div className="mt-2 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-[#2563EB] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-[#E5E7EB] bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-[#F59E0B]" />
                      <span className="text-xs text-[#6B7280]">Deadline Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#F59E0B]">2</span>
                      <span className="text-xs text-[#6B7280]">tasks at risk</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-white">
                    <Brain size={18} className="text-[#2563EB]" />
                    <div>
                      <p className="text-xs font-medium text-[#111827]">AI Suggestion</p>
                      <p className="text-[11px] text-[#6B7280]">Review design first</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-white">
                    <Timer size={18} className="text-[#2563EB]" />
                    <div>
                      <p className="text-xs font-medium text-[#111827]">Focus Timer</p>
                      <p className="text-[11px] text-[#6B7280]">25:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
