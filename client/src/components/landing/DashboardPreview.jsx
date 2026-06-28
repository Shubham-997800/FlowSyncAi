import { motion } from 'framer-motion'
import { ListTodo, Calendar, Brain, BarChart3, Clock } from 'lucide-react'

const tabs = [
  { icon: ListTodo, label: 'Tasks' },
  { icon: Calendar, label: 'Calendar' },
  { icon: Brain, label: 'AI Planner' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Clock, label: 'Focus' },
]

function DashboardPreview() {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-[#111827] text-center mb-4"
        >
          Complete Productivity Dashboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#6B7280] text-center mb-14 max-w-2xl mx-auto"
        >
          Everything you need in one place — tasks, calendar, AI planner, analytics, and focus mode.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
            <span className="ml-3 text-sm font-medium text-[#6B7280]">flowsync.ai</span>
          </div>

          <div className="flex border-b border-[#E5E7EB] bg-white">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.label}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab.label === 'Tasks'
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-[#111827]">Today's Tasks</h3>
              {[
                { title: 'Design system review', time: '9:00 - 10:30', priority: 'High', color: '#DC2626' },
                { title: 'API documentation', time: '11:00 - 12:00', priority: 'Medium', color: '#F59E0B' },
                { title: 'Team standup', time: '12:30 - 1:00', priority: 'Low', color: '#16A34A' },
                { title: 'Frontend deployment', time: '2:00 - 4:00', priority: 'High', color: '#DC2626' },
                { title: 'Code review', time: '4:30 - 5:30', priority: 'Medium', color: '#F59E0B' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors">
                  <div className="w-4 h-4 rounded border-2 border-[#E5E7EB] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827]">{task.title}</p>
                    <p className="text-xs text-[#6B7280]">{task.time}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                    style={{ backgroundColor: `${task.color}15`, color: task.color }}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] p-5">
                <h4 className="text-sm font-semibold text-[#111827] mb-3">Calendar</h4>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                    <span key={d} className="text-[#6B7280] py-1">{d}</span>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => (
                    <span
                      key={i}
                      className={`py-1 rounded ${
                        i + 1 === 15 ? 'bg-[#2563EB] text-white' : 'text-[#111827]'
                      } ${i + 1 === 12 || i + 1 === 14 ? 'font-semibold text-[#2563EB]' : ''}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] p-5">
                <h4 className="text-sm font-semibold text-[#111827] mb-3">AI Suggestion</h4>
                <p className="text-sm text-[#6B7280]">Move "Design review" to morning — highest impact task.</p>
                <button className="mt-3 text-xs font-medium text-[#2563EB] hover:underline">Apply</button>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] p-5">
                <h4 className="text-sm font-semibold text-[#111827] mb-3">Productivity Score</h4>
                <p className="text-2xl font-bold text-[#2563EB]">87%</p>
                <div className="mt-2 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full w-[87%] bg-[#2563EB] rounded-full" />
                </div>
                <p className="text-xs text-[#6B7280] mt-2">+12% from last week</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DashboardPreview
