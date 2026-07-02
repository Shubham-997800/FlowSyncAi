import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/AuthLayout'
import LegalModal from '../../components/LegalModal'
import FormField from '../../components/ui/FormField'
import { validateEmail } from '../../utils/validation'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const validate = useCallback(() => {
    const e = {}
    const emailErr = validateEmail(form.email)
    if (emailErr) e.email = emailErr
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data
      if (msg?.needsVerification) {
        setNeedsVerification(msg.email)
        toast.error('Email not verified. Check your inbox or resend OTP.')
      } else {
        toast.error(msg?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const update = useCallback((field, value) => {
    const normalizedValue = field === 'email' ? value.trim() : value
    setForm(prev => ({ ...prev, [field]: normalizedValue }))
    if (errors[field]) {
      const next = { ...errors }
      if (field === 'email') {
        const emailErr = validateEmail(normalizedValue)
        if (emailErr) next.email = emailErr
        else delete next.email
      } else {
        if (!normalizedValue) next[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        else delete next[field]
      }
      setErrors(next)
    }
  }, [errors])

  return (
    <>
      <Helmet>
        <title>Sign In — FlowSync AI</title>
        <meta name="description" content="Sign in to your FlowSync AI account to manage tasks, plan smarter, and boost productivity with AI." />
      </Helmet>

      <AuthLayout
        mode="login"
        title="Welcome Back."
        subtitle="Continue your productivity journey with AI-powered planning."
        footer="Protected by secure authentication."
      >
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <FormField name="email" label="Email Address" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} touched={errors.email} inputRef={emailRef} />
          <FormField name="password" label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="Enter your password" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} touched={errors.password}>
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </FormField>

          {needsVerification && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
              <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <p className="font-medium mb-1">Email not verified</p>
                <p>Please verify before signing in.</p>
                <Link to={`/verify-email?email=${encodeURIComponent(needsVerification)}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block">
                  Verify now →
                </Link>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Forgot Password?</Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : 'Sign In'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Sign Up</Link>
        </p>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          By signing in, you agree to our{' '}
          <button type="button" onClick={() => setLegal('terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Terms</button>
          {' '}&amp;{' '}
          <button type="button" onClick={() => setLegal('privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Privacy Policy</button>
        </p>
      </AuthLayout>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  )
}

export default Login
