import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { updatePassword } from '../../services/settingsService'

function getStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' }
  if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' }
  return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' }
}

function ChangePassword() {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false })
  const strength = getStrength(form.newPw)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.current || !form.newPw || !form.confirm) { toast.error('All fields are required'); return }
    if (form.newPw !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    try {
      await updatePassword({ currentPassword: form.current, newPassword: form.newPw })
      toast.success('Password changed successfully')
      setForm({ current: '', newPw: '', confirm: '' })
    } catch { toast.error('Failed to update password. Check your current password.') }
  }

  const fields = [
    { key: 'current', label: 'Current Password' },
    { key: 'newPw', label: 'New Password' },
    { key: 'confirm', label: 'Confirm New Password' },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Lock size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <div className="relative">
              <input type={show[key] ? 'text' : 'password'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
              <button type="button" onClick={() => setShow({ ...show, [key]: !show[key] })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        {form.newPw && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Password Strength</span>
              <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${((strength.label === 'Weak' ? 1 : strength.label === 'Medium' ? 3 : 5) / 5) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-1">
              {[
                { check: form.newPw.length >= 8, text: 'At least 8 characters' },
                { check: form.newPw.length >= 12, text: 'At least 12 characters (recommended)' },
                { check: /[a-z]/.test(form.newPw) && /[A-Z]/.test(form.newPw), text: 'Upper & lowercase letters' },
                { check: /\d/.test(form.newPw), text: 'At least one number' },
                { check: /[^a-zA-Z0-9]/.test(form.newPw), text: 'At least one special character' },
              ].map(({ check, text }, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px]">
                  {check ? <CheckCircle size={11} className="text-emerald-500" /> : <XCircle size={11} className="text-slate-400" />}
                  <span className={check ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200">
          <Shield size={16} /> Update Password
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
