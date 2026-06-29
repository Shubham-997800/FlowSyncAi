import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-4 text-sm leading-relaxed">
          <p>Your privacy is important to us. This policy explains how FlowSync AI handles your data.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Data Collection</h2>
          <p>We collect your name, email, and productivity data (tasks, goals, habits) to provide our AI-powered planning services.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">2. Data Storage</h2>
          <p>Your data is stored securely in MongoDB Atlas with encryption. We do not share your personal data with third parties.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. AI Processing</h2>
          <p>Task and schedule data may be processed through Google Gemini AI to provide planning suggestions. No personal identifiers are sent.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4. Your Rights</h2>
          <p>You can access, modify, or delete your data anytime through your account settings or by contacting us.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">5. Contact</h2>
          <p>For privacy concerns, reach out through our support channels.</p>
          <p className="text-xs text-slate-400 pt-4">Last updated: June 2026</p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
