import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Loader2, Brain, Clock, AlertTriangle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import LegalModal from '../../components/LegalModal'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [agree, setAgree] = useState(false)
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-white dark:bg-zinc-900 p-12 border-r border-slate-200 dark:border-zinc-800">
        <div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</span>
          <div className="mt-12">
            <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles size={12} /> AI Productivity Platform
            </span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-6 leading-tight">Welcome Back.</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
              Continue your productivity journey with AI-powered planning.
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">
              Manage tasks, plan smarter, and complete work before deadlines with FlowSync AI.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {[
              { icon: Brain, text: 'AI Task Prioritization' },
              { icon: Clock, text: 'Smart Scheduling' },
              { icon: AlertTriangle, text: 'Focus Mode' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Icon size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{text}</span>
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign In</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Access your FlowSync AI workspace.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Forgot Password?</Link>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer" />
                <span className="text-sm text-slate-600 dark:text-slate-400">I agree to <button type="button" onClick={() => setLegal('terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Terms</button> &amp; <button type="button" onClick={() => setLegal('privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Privacy Policy</button></span>
              </label>

              <button type="submit" disabled={loading || !agree}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">Sign Up</Link>
            </p>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">Protected by secure authentication.</p>
        </div>
      </div>
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </div>
  )
}

export default Login
