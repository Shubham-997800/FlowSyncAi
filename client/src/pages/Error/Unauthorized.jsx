import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">You don't have permission to access this page. Contact your administrator if you believe this is a mistake.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200">
            <Home size={16} /> Go to Dashboard
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors duration-200">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
