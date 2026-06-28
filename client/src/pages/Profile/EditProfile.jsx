import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

function EditProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', bio: '', role: user?.role || 'Student', location: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    toast.success('Profile updated successfully')
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
    { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself...' },
    { key: 'role', label: 'Role', type: 'select', options: ['Student', 'Professional', 'Freelancer', 'Entrepreneur', 'Other'] },
    { key: 'location', label: 'Location', type: 'text', placeholder: 'City, Country' },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-5">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {fields.map(({ key, label, type, required, placeholder, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {type === 'textarea' ? (
              <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none" />
            ) : type === 'select' ? (
              <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            )}
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
          </div>
        ))}
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200">
          <Save size={16} /> Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditProfile
