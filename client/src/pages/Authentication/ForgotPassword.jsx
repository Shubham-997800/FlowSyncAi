import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
    toast.success('Reset link sent to your email')
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Link Sent</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Check your inbox and follow the instructions to reset your password.
          </p>
          <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5">
          <Lock size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Forgot Your Password?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 leading-relaxed">
          Enter your registered email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Sending Link...</> : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
