import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/AuthLayout'
import LegalModal from '../../components/LegalModal'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type, icon: Icon, placeholder, children }) => {
    const hasError = errors[name]
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
        <div className="relative">
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id={name}
            ref={name === 'email' ? emailRef : null}
            type={type}
            required
            value={form[name]}
            onChange={(e) => { setForm({ ...form, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: '' }) }}
            placeholder={placeholder}
            aria-invalid={!!hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`w-full pl-10 ${children ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${hasError ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-600 dark:focus:ring-indigo-500'}`}
          />
          {children}
        </div>
        {hasError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${name}-error`} className="flex items-center gap-1 mt-1 text-xs text-red-500">
            <AlertCircle size={12} /> {hasError}
          </motion.p>
        )}
      </div>
    )
  }

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
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field name="email" label="Email Address" type="email" icon={Mail} placeholder="you@example.com" />
          <Field name="password" label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="Enter your password">
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

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
