import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle2, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { resetPassword } from '../../services/authService'

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

function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const strength = passwordStrength(password)

  const validate = () => {
    const e = {}
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'At least 6 characters'
    else if (!/[A-Z]/.test(password)) e.password = 'Add an uppercase letter'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ password: true, confirm: true })
    if (!validate()) return
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      toast.success('Password reset successful')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  const update = (field, value) => {
    if (field === 'password') setPassword(value)
    if (field === 'confirm') setConfirm(value)
    if (touched[field]) {
      const e = { ...errors }
      if (field === 'password') {
        if (!value) e.password = 'Password is required'
        else if (value.length < 6) e.password = 'At least 6 characters'
        else if (!/[A-Z]/.test(value)) e.password = 'Add an uppercase letter'
        else delete e.password
        if (confirm && confirm !== value) e.confirm = 'Passwords do not match'
        else if (confirm === value) delete e.confirm
      }
      if (field === 'confirm') {
        if (!value) e.confirm = 'Please confirm your password'
        else if (password !== value) e.confirm = 'Passwords do not match'
        else delete e.confirm
      }
      setErrors(e)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Password Reset</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Your password has been updated successfully.</p>
          <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
            <ArrowLeft size={14} /> Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Reset Password — FlowSync AI</title>
        <meta name="description" content="Set a new password for your FlowSync AI account." />
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
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">Set New Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 leading-relaxed">Enter your new password below.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="new-password"
                    ref={inputRef}
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => update('password', e.target.value)}
                    onBlur={() => { setTouched({ ...touched, password: true }); validate() }}
                    placeholder="Min 6 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'pw-error' : undefined}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${errors.password ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
                  />
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id="pw-error" className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.password}
                  </motion.p>
                )}
              </div>

              {touched.password && password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="-mt-2 space-y-1.5">
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
                      { check: password.length >= 6, label: 'At least 6 characters' },
                      { check: /[A-Z]/.test(password), label: 'One uppercase letter' },
                      { check: /[0-9]/.test(password), label: 'One number' },
                    ].map(({ check, label }) => (
                      <li key={label} className={`flex items-center gap-1 text-xs ${check ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {check ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-zinc-600" />}
                        {label}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirm-password"
                    type={show ? 'text' : 'password'}
                    required
                    value={confirm}
                    onChange={(e) => update('confirm', e.target.value)}
                    onBlur={() => { setTouched({ ...touched, confirm: true }); validate() }}
                    placeholder="Re-enter password"
                    aria-invalid={!!errors.confirm}
                    aria-describedby={errors.confirm ? 'conf-error' : undefined}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${errors.confirm ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
                  />
                </div>
                {errors.confirm && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id="conf-error" className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.confirm}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset Password'}
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

export default ResetPassword
