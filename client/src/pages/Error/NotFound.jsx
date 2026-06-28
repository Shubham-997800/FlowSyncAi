import { Search, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto">
            <Search size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">?</span>
          </div>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">404</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Page not found in FlowSync AI. The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200">
          <Home size={16} /> Go to Dashboard
        </button>
      </div>
    </div>
  )
}

export default NotFound
