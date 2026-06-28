import { Link } from 'react-router-dom'
import { Sparkles, Brain, Clock, CheckCircle, Play, ListTodo, AlertTriangle, Target, BarChart3, Calendar, Timer, TrendingUp, Layers, LayoutDashboard } from 'lucide-react'

function FloatingCard({ icon: Icon, text, sub, delay, className }) {
  return (
    <div
      className={`absolute hidden lg:flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ animation: `float 3s ease-in-out ${delay}s infinite` }}
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{text}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-16 items-center">
          <div className="col-span-3 mb-16 lg:mb-0">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              AI-Powered Productivity Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Never Miss a Deadline Again.
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              Plan Smarter. Focus Better. Finish Faster.
            </p>
            <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              FlowSync AI is an intelligent productivity companion that analyzes your tasks, predicts deadline risks, prioritizes work, and creates personalized schedules so you can complete important work before deadlines are missed.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register" className="bg-emerald-600 text-white px-7 py-3 rounded-xl text-base font-semibold hover:bg-emerald-700 transition shadow-sm">
                Get Started
              </Link>
              <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-7 py-3 rounded-xl text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <Play size={18} /> Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10 text-sm text-gray-500 dark:text-gray-400">
              {[
                { icon: Brain, label: 'AI-Powered Planning' },
                { icon: Clock, label: 'Smart Scheduling' },
                { icon: AlertTriangle, label: 'Deadline Prediction' },
                { icon: Target, label: 'Focus Mode' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-2 relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex h-[420px] sm:h-[480px]">
                <div className="w-14 sm:w-16 bg-gray-50 dark:bg-gray-850 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3 py-4">
                  {[LayoutDashboard, ListTodo, BarChart3, Calendar, Timer, Layers].map((Icon, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      <Icon size={16} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Dashboard</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">Today</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <ListTodo size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Today's Tasks</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
                      <div className="flex -space-x-1 mt-1.5">
                        {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-800" />)}
                        <span className="text-[9px] text-gray-400 ml-1">+5</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain size={12} className="text-purple-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">AI Suggest</span>
                      </div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">Focus on "Q4 Report" — deadline tomorrow</p>
                      <span className="inline-block mt-1.5 text-[9px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">High Priority</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Productivity</span>
                      </div>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">92%</p>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-1.5">
                        <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Deadline Risk</span>
                      </div>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">3 At Risk</p>
                      <div className="flex gap-1 mt-1.5">
                        {['M','T','W','T','F'].map((d,i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i === 2 ? 'bg-amber-400' : i < 2 ? 'bg-emerald-300' : 'bg-gray-200 dark:bg-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Calendar size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Calendar</span>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {['S','M','T','W','T','F','S'].map((d,i) => (
                          <span key={i} className="text-[7px] text-center font-medium text-gray-400">{d}</span>
                        ))}
                        {Array.from({length: 7}).map((_, i) => (
                          <div key={i} className={`text-[7px] text-center py-0.5 rounded ${i === 3 ? 'bg-emerald-500 text-white font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{i + 15}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Timer size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Focus Timer</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">25:00</p>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500">Focus session ready</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-850 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Task Progress</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Q4 Report', pct: 75, color: 'bg-emerald-500' },
                        { label: 'Design Review', pct: 40, color: 'bg-amber-400' },
                        { label: 'Email Outreach', pct: 90, color: 'bg-emerald-500' },
                      ].map(({ label, pct, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 w-16 truncate">{label}</span>
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 w-5 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FloatingCard icon={Brain} text="AI Prioritized" sub="12 Tasks" delay={0} className="-top-6 -right-6" />
            <FloatingCard icon={Clock} text="Saved 3 Hours" sub="Today" delay={0.4} className="-bottom-4 -left-8" />
            <FloatingCard icon={CheckCircle} text="92% Productivity" sub="Score" delay={0.8} className="-right-4 bottom-16" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
