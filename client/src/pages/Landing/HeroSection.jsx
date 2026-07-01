import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Clock, CheckCircle, AlertTriangle, Target, BarChart3, Calendar, Timer, LayoutDashboard, ArrowRight, ListTodo, TrendingUp, Layers } from 'lucide-react'

function FloatingCard({ icon: Icon, text, sub, delay, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay, ease: 'easeOut' },
        scale: { duration: 0.5, delay, ease: 'easeOut' },
        y: { duration: 3, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`absolute hidden lg:flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl px-5 py-3 shadow-lg border border-slate-200 dark:border-zinc-800 will-change-transform ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{text}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </motion.div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />
      <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-16 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="col-span-3 mb-16 lg:mb-0"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              AI-Powered Productivity Platform
            </motion.div>

            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
              Never Miss a Deadline Again.
            </motion.h1>
            <motion.p variants={item} className="text-2xl sm:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
              Plan Smarter. Focus Better. Finish Faster.
            </motion.p>
            <motion.p variants={item} className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              FlowSync AI is an intelligent productivity companion that analyzes your tasks, predicts deadline risks, prioritizes work, and creates personalized schedules so you can complete important work before deadlines are missed.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mt-8">
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-7 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]">
                Get Started
              </Link>
              <a href="#features" className="flex items-center gap-2 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 px-7 py-3 rounded-xl text-base font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-300 active:scale-[0.97]">
                Explore Features <ArrowRight size={18} />
              </a>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-x-8 gap-y-3 mt-10 text-sm text-slate-500 dark:text-slate-400">
              {[
                { icon: Brain, label: 'AI-Powered Planning' },
                { icon: Clock, label: 'Smart Scheduling' },
                { icon: AlertTriangle, label: 'Deadline Prediction' },
                { icon: Target, label: 'Focus Mode' },
              ].map(({ label }) => (
                <span key={label} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="col-span-2 relative"
          >
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
              <div className="flex h-[420px] sm:h-[480px]">
                <div className="w-14 sm:w-16 bg-slate-50 dark:bg-zinc-900/50 border-r border-slate-200 dark:border-zinc-800 flex flex-col items-center gap-3 py-4">
                  {[LayoutDashboard, ListTodo, BarChart3, Calendar, Timer, Layers].map((Icon, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-700'}`}>
                      <Icon size={16} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Dashboard</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Today</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <ListTodo size={12} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Today's Tasks</span>
                      </div>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">8</p>
                      <div className="flex -space-x-1 mt-1.5">
                        {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-slate-300 dark:bg-zinc-700 border border-white dark:border-zinc-900" />)}
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-1">+5</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain size={12} className="text-purple-500 dark:text-purple-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">AI Suggest</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">Focus on "Q4 Report" — deadline tomorrow</p>
                      <span className="inline-block mt-1.5 text-[9px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">High Priority</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target size={12} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Productivity</span>
                      </div>
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">92%</p>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mt-1.5">
                        <div className="w-[92%] h-full bg-indigo-500 dark:bg-indigo-400 rounded-full" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={12} className="text-amber-500 dark:text-amber-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Deadline Risk</span>
                      </div>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">3 At Risk</p>
                      <div className="flex gap-1 mt-1.5">
                        {['M','T','W','T','F'].map((d,i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i === 2 ? 'bg-amber-400' : i < 2 ? 'bg-indigo-300' : 'bg-slate-200 dark:bg-zinc-700'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Calendar size={12} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Calendar</span>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {['S','M','T','W','T','F','S'].map((d,i) => (
                          <span key={i} className="text-[7px] text-center font-medium text-slate-400 dark:text-slate-500">{d}</span>
                        ))}
                        {Array.from({length: 7}).map((_, i) => (
                          <div key={i} className={`text-[7px] text-center py-0.5 rounded ${i === 3 ? 'bg-indigo-500 dark:bg-indigo-400 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{i + 15}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Timer size={12} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Focus Timer</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">25:00</p>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">Focus session ready</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp size={12} className="text-indigo-500 dark:text-indigo-400" />
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Task Progress</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Q4 Report', pct: 75, color: 'bg-indigo-500' },
                        { label: 'Design Review', pct: 40, color: 'bg-amber-400' },
                        { label: 'Email Outreach', pct: 90, color: 'bg-indigo-500' },
                      ].map(({ label, pct, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 w-16 truncate">{label}</span>
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full">
                            <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 w-5 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FloatingCard icon={Brain} text="AI Prioritized" sub="12 Tasks" delay={0.6} className="-top-6 -right-6" />
            <FloatingCard icon={Clock} text="Saved 3 Hours" sub="Today" delay={0.8} className="-bottom-4 -left-8" />
            <FloatingCard icon={CheckCircle} text="92% Productivity" sub="Score" delay={1.0} className="-right-4 bottom-16" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default memo(HeroSection)
