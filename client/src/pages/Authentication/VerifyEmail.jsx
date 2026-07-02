import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Loader2, RefreshCw, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/AuthLayout'
import { validateEmail } from '../../utils/validation'
import { openBrowserSettings } from '../../utils/permissions'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const { verifyEmail, resendOTP } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [emailError, setEmailError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [notifDenied, setNotifDenied] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const requestNotifPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'denied') { setNotifDenied(true); return }
    if (Notification.permission !== 'default') return
    try {
      const result = await Notification.requestPermission()
      if (result === 'denied') setNotifDenied(true)
    } catch {
    }
  }, [])

  useEffect(() => {
    requestNotifPermission()
  }, [requestNotifPermission])

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleEmailChange = (value) => {
    const err = validateEmail(value)
    setEmailError(err || '')
    setEmail(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      await verifyEmail(email, code)
      toast.success('Email verified! Welcome to FlowSync.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || !email) return
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }
    setResending(true)
    try {
      await resendOTP(email)
      toast.success('OTP resent to your email')
      setCountdown(60)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Verify Email — FlowSync AI</title>
        <meta name="description" content="Verify your email address to start using FlowSync AI." />
      </Helmet>

      <AuthLayout
        mode="verify"
        title="Verify Your Email"
        subtitle={`Enter the 6-digit code sent to ${email || 'your email'}`}
        footer="Check your spam folder if you don't see the email."
      >
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${emailError ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-600 dark:focus:ring-indigo-500'}`}
              />
            </div>
            {emailError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id="email-error" className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <span className="w-3 h-3" /> {emailError}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">OTP Code</label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent transition-colors duration-300"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {notifDenied && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
              <Bell size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 flex-1">Enable notifications to get OTP alerts instantly.</p>
              <button type="button" onClick={openBrowserSettings} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">Fix</button>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify Email'}
          </motion.button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || countdown > 0 || !!emailError}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Back to Sign In</Link>
        </p>
      </AuthLayout>
    </>
  )
}

export default VerifyEmail
