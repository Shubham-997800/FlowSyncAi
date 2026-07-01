import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { forgotPassword } from '../../services/authService'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const validate = (val) => {
    if (!val.trim()) { setError('Email is required'); return false }
    if (!/\S+@\S+\.\S+/.test(val)) { setError('Invalid email format'); return false }
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate(email)) return
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent to your email')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally { setLoading(false) }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Link Sent</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Check your inbox and follow the instructions to reset your password.</p>
          <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password — FlowSync AI</title>
        <meta name="description" content="Reset your FlowSync AI account password. Enter your email to receive a password reset link." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-5">
              <Lock size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">Forgot Your Password?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 leading-relaxed">Enter your registered email address and we'll send you a password reset link.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    ref={inputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                    placeholder="you@example.com"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'email-error' : undefined}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
                  />
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id="email-error" className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending Link...</> : 'Send Reset Link'}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-300">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPassword
