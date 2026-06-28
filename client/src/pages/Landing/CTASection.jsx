import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function CTASection() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Ready to Take Control of Your Time?</h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Join users who plan smarter, work faster, and never miss important deadlines with FlowSync AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/register" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-emerald-700 transition shadow-sm">
            Start Free
          </Link>
          <a href="#features" className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Explore Features <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection
