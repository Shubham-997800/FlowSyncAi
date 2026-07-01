import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/AuthLayout'
import LegalModal from '../../components/LegalModal'

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})
  const { register } = useAuth()
  const navigate = useNavigate()
  const nameRef = useRef(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const strength = passwordStrength(form.password)

  const validate = (field) => {
    const e = { ...errors }
    if (!field || field === 'name') {
      if (!form.name.trim()) e.name = 'Name is required'
      else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
      else delete e.name
    }
    if (!field || field === 'email') {
      if (!form.email.trim()) e.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
      else delete e.email
    }
    if (!field || field === 'password') {
      if (!form.password) e.password = 'Password is required'
      else if (form.password.length < 6) e.password = 'At least 6 characters'
      else if (!/[A-Z]/.test(form.password)) e.password = 'Add an uppercase letter'
      else if (!/[0-9]/.test(form.password)) e.password = 'Add a number'
      else delete e.password
    }
    if (!field || field === 'confirmPassword') {
      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
      else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
      else delete e.confirmPassword
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    validate(field)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { name: true, email: true, password: true, confirmPassword: true }
    setTouched(allTouched)
    if (!validate() || !agree) {
      if (!agree) toast.error('Please agree to the Terms & Privacy Policy')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const update = (field, value) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) {
      const e = { ...errors }
      if (field === 'password') {
        if (!value) e.password = 'Password is required'
        else if (value.length < 6) e.password = 'At least 6 characters'
        else if (!/[A-Z]/.test(value)) e.password = 'Add an uppercase letter'
        else if (!/[0-9]/.test(value)) e.password = 'Add a number'
        else delete e.password
        if (next.confirmPassword && next.confirmPassword !== value) e.confirmPassword = 'Passwords do not match'
        else if (next.confirmPassword === value) delete e.confirmPassword
      } else if (field === 'confirmPassword') {
        if (!value) e.confirmPassword = 'Please confirm your password'
        else if (next.password !== value) e.confirmPassword = 'Passwords do not match'
        else delete e.confirmPassword
      } else if (field === 'name') {
        if (!value.trim()) e.name = 'Name is required'
        else if (value.trim().length < 2) e.name = 'Name must be at least 2 characters'
        else delete e.name
      } else if (field === 'email') {
        if (!value.trim()) e.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(value)) e.email = 'Invalid email format'
        else delete e.email
      }
      setErrors(e)
    }
  }

  const Field = ({ name, label, type, icon: Icon, placeholder, children }) => {
    const hasError = touched[name] && errors[name]
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
        <div className="relative">
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id={name}
            ref={name === 'name' ? nameRef : null}
            type={type}
            required
            value={form[name]}
            onChange={(e) => update(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            aria-invalid={!!hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`w-full pl-10 ${children ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${hasError ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
          />
          {children}
        </div>
        {hasError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${name}-error`} className="flex items-center gap-1 mt-1 text-xs text-red-500">
            <AlertCircle size={12} /> {errors[name]}
          </motion.p>
        )}
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Create Account — FlowSync AI</title>
        <meta name="description" content="Sign up for FlowSync AI and let AI manage your productivity — task planning, deadline prediction, and smart scheduling." />
      </Helmet>

      <AuthLayout
        mode="register"
        title="Start Organizing Smarter."
        subtitle="Create your FlowSync AI account and let AI manage your productivity."
        footer="Your data stays private and secure."
      >
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field name="name" label="Full Name" type="text" icon={User} placeholder="John Doe" />
          <Field name="email" label="Email" type="email" icon={Mail} placeholder="you@example.com" />

          <Field name="password" label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="Min. 6 characters">
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          {touched.password && form.password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-zinc-700'}`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${strength >= 4 ? 'text-green-600 dark:text-green-400' : strength >= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'}`}>
                {strengthLabels[strength]}
              </p>
              <ul className="space-y-0.5">
                {[
                  { check: form.password.length >= 6, label: 'At least 6 characters' },
                  { check: /[A-Z]/.test(form.password), label: 'One uppercase letter' },
                  { check: /[0-9]/.test(form.password), label: 'One number' },
                ].map(({ check, label }) => (
                  <li key={label} className={`flex items-center gap-1 text-xs ${check ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {check ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-zinc-600" />}
                    {label}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <Field name="confirmPassword" label="Confirm Password" type={showConfirm ? 'text' : 'password'} icon={Lock} placeholder="Re-enter your password">
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              I agree to the{' '}
              <button type="button" onClick={() => setLegal('terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Terms</button>
              {' '}&amp;{' '}
              <button type="button" onClick={() => setLegal('privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Privacy Policy</button>
            </span>
          </label>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Sign In</Link>
        </p>
      </AuthLayout>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  )
}

export default Register
