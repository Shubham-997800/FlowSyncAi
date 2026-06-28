import { PenSquare, Brain, Calendar, CheckCircle, Clock, Target, Shield } from 'lucide-react'

const steps = [
  { icon: PenSquare, title: 'Create Your Tasks', desc: 'Add tasks naturally — AI reads deadlines, priority, and dependencies automatically.' },
  { icon: Brain, title: 'AI Understands Priority & Deadlines', desc: 'Our engine analyzes urgency, workload, and risk to rank what matters most.' },
  { icon: Calendar, title: 'AI Builds Your Daily Schedule', desc: 'An optimized plan is generated around your meetings, energy, and focus time.' },
  { icon: CheckCircle, title: 'Complete Work Before Deadlines', desc: 'Track progress, adjust on the fly, and never miss another deadline.' },
]

const benefits = [
  { icon: Clock, title: 'Save Time', desc: 'Stop deciding what to do. AI plans your day so you can focus on execution.' },
  { icon: Target, title: 'Stay Focused', desc: 'Eliminate context switching with timed focus blocks tailored to your workload.' },
  { icon: Shield, title: 'Never Miss Deadlines', desc: 'Early risk alerts and smart replanning keep every deadline within reach.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">How FlowSync AI Works</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Four simple steps from task creation to deadline mastery.</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-5">
                  <Icon size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="absolute top-6 -left-4 w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center z-20 shadow-sm">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
                <Icon size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
