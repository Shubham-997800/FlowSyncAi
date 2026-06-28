import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function CTASection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Ready to Take Control of Your Time?</h2>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Join users who plan smarter, work faster, and never miss important deadlines with FlowSync AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors duration-300 shadow-sm">
            Start Free
          </Link>
          <a href="#features" className="flex items-center gap-2 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
            Explore Features <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection
