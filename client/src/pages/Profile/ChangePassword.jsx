import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { updatePassword } from '../../services/settingsService'

function getStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 20 }
  if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500', width: 60 }
  return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: 100 }
}

const checks = [
  { key: 'len8', test: (v) => v.length >= 8, text: 'At least 8 characters' },
  { key: 'len12', test: (v) => v.length >= 12, text: 'At least 12 characters (recommended)' },
  { key: 'case', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v), text: 'Upper & lowercase letters' },
  { key: 'num', test: (v) => /\d/.test(v), text: 'At least one number' },
  { key: 'special', test: (v) => /[^a-zA-Z0-9]/.test(v), text: 'At least one special character' },
]

function ChangePassword() {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false })
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const strength = form.newPw ? getStrength(form.newPw) : null

  const errors = {}
  if (touched.confirm && form.confirm && form.newPw !== form.confirm) errors.confirm = 'Passwords do not match'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ current: true, newPw: true, confirm: true })
    if (!form.current || !form.newPw || !form.confirm) { toast.error('All fields are required'); return }
    if (form.newPw !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await updatePassword({ currentPassword: form.current, newPassword: form.newPw })
      toast.success('Password changed successfully')
      setForm({ current: '', newPw: '', confirm: '' })
      setTouched({})
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password. Check your current password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Lock size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
          <div className="relative">
            <input type={show.current ? 'text' : 'password'} value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} onBlur={() => setTouched({ ...touched, current: true })} className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" placeholder="Enter current password" />
            <button type="button" onClick={() => setShow({ ...show, current: !show.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <input type={show.newPw ? 'text' : 'password'} value={form.newPw} onChange={e => setForm({ ...form, newPw: e.target.value })} onBlur={() => setTouched({ ...touched, newPw: true })} className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" placeholder="Enter new password" />
            <button type="button" onClick={() => setShow({ ...show, newPw: !show.newPw })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {show.newPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
          <div className="relative">
            <input type={show.confirm ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} onBlur={() => setTouched({ ...touched, confirm: true })} className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${errors.confirm ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`} placeholder="Re-enter new password" />
            <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle size={12} /> {errors.confirm}</p>}
        </div>

        {form.newPw && strength && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Password Strength</span>
              <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.width}%` }} />
            </div>
            <ul className="mt-3 space-y-1">
              {checks.map(({ key, test, text }) => {
                const ok = test(form.newPw)
                return (
                  <li key={key} className="flex items-center gap-1.5 text-[11px]">
                    {ok ? <CheckCircle size={11} className="text-emerald-500" /> : <XCircle size={11} className="text-slate-400" />}
                    <span className={ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>{text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading || !form.current || !form.newPw || !form.confirm || form.newPw !== form.confirm} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
