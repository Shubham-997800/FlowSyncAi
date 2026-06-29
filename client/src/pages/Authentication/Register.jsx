import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, Loader2, Brain, AlertTriangle, BarChart3, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import LegalModal from '../../components/LegalModal'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (!agree) return toast.error('Please agree to the Terms & Privacy Policy')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-white dark:bg-zinc-900 p-12 border-r border-slate-200 dark:border-zinc-800">
        <div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</span>
          <div className="mt-12">
            <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"><Sparkles size={12} /> AI Productivity Platform</span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-6 leading-tight">Start Organizing Smarter.</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">Create your FlowSync AI account and let AI manage your productivity.</p>
          </div>
          <div className="mt-10 space-y-4">
            {[
              { icon: Brain, title: 'AI Planning', desc: 'Let AI build your daily schedule' },
              { icon: AlertTriangle, title: 'Deadline Prediction', desc: 'Never miss an important deadline' },
              { icon: BarChart3, title: 'Productivity Insights', desc: 'Track what matters with analytics' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">&copy; 2026 FlowSync AI. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start your productivity journey.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer" />
                <span className="text-sm text-slate-600 dark:text-slate-400">I agree to <button type="button" onClick={() => setLegal('terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Terms</button> &amp; <button type="button" onClick={() => setLegal('privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Privacy Policy</button></span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Sign In</Link>
            </p>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">Your data stays private and secure.</p>
        </div>
      </div>
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </div>
  )
}

export default Register
