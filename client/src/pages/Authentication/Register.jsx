import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/AuthLayout'
import LegalModal from '../../components/LegalModal'
import FormField from '../../components/ui/FormField'
import { validateEmail } from '../../utils/validation'

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
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
  const formRef = useRef(form)
  const errorsRef = useRef(errors)
  const touchedRef = useRef(touched)

  useEffect(() => { formRef.current = form })
  useEffect(() => { errorsRef.current = errors })
  useEffect(() => { touchedRef.current = touched })

  useEffect(() => { nameRef.current?.focus() }, [])

  const strength = passwordStrength(form.password)

  const validate = useCallback((field) => {
    const f = formRef.current
    const e = { ...errorsRef.current }
    if (!field || field === 'name') {
      if (!f.name.trim()) e.name = 'Name is required'
      else if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
      else delete e.name
    }
    if (!field || field === 'email') {
      const emailErr = validateEmail(f.email)
      if (emailErr) e.email = emailErr
      else delete e.email
    }
    if (!field || field === 'password') {
      if (!f.password) e.password = 'Password is required'
      else if (f.password.length < 8) e.password = 'At least 8 characters'
      else if (!/[A-Z]/.test(f.password)) e.password = 'Add an uppercase letter'
      else if (!/[0-9]/.test(f.password)) e.password = 'Add a number'
      else delete e.password
    }
    if (!field || field === 'confirmPassword') {
      if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password'
      else if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match'
      else delete e.confirmPassword
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }, [])

  const handleBlur = useCallback((field) => {
    setTouched(prev => {
      const next = { ...prev, [field]: true }
      touchedRef.current = next
      return next
    })
    validate(field)
  }, [validate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const f = formRef.current
    const allTouched = { name: true, email: true, password: true, confirmPassword: true }
    touchedRef.current = allTouched
    setTouched(allTouched)
    if (!validate() || !agree) {
      if (!agree) toast.error('Please agree to the Terms & Privacy Policy')
      return
    }
    setLoading(true)
    try {
      const data = await register(f.name, f.email, f.password)
      if (data.token) {
        toast.success('Account created! Welcome to FlowSync AI.')
        navigate('/dashboard')
      } else {
        toast.success('Account created! Check your email for the OTP.')
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message
      if (err.response?.data?.email) {
        navigate(`/verify-email?email=${encodeURIComponent(err.response.data.email)}`)
        toast.error(serverMsg || 'Account found. Verify your email.')
      } else {
        toast.error(serverMsg || 'Registration failed. Check your details and try again.')
      }
    } finally { setLoading(false) }
  }

  const update = useCallback((field, value) => {
    const normalizedValue = field === 'email' ? value.trim() : value
    setForm(prev => {
      const next = { ...prev, [field]: normalizedValue }
      formRef.current = next
      if (touchedRef.current[field]) {
        const e = { ...errorsRef.current }
        if (field === 'password') {
          if (!value) e.password = 'Password is required'
          else if (value.length < 8) e.password = 'At least 8 characters'
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
          const emailErr = validateEmail(normalizedValue)
          if (emailErr) e.email = emailErr
          else delete e.email
        }
        errorsRef.current = e
        setErrors(e)
      }
      return next
    })
  }, [])

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
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <FormField name="name" label="Full Name" type="text" icon={User} placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => handleBlur('name')} error={errors.name} touched={touched.name} inputRef={nameRef} />

          <FormField name="email" label="Email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} onBlur={() => handleBlur('email')} error={errors.email} touched={touched.email} />

          <FormField name="password" label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="Min. 8 characters" value={form.password} onChange={(e) => update('password', e.target.value)} onBlur={() => handleBlur('password')} error={errors.password} touched={touched.password}>
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </FormField>

          {touched.password && form.password && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
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
                  { check: form.password.length >= 8, label: 'At least 8 characters' },
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

          <FormField name="confirmPassword" label="Confirm Password" type={showConfirm ? 'text' : 'password'} icon={Lock} placeholder="Re-enter your password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')} error={errors.confirmPassword} touched={touched.confirmPassword}>
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </FormField>

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
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Sign In</Link>
        </p>
      </AuthLayout>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  )
}

export default Register
