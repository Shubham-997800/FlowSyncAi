import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Save, User, Mail, Phone, Briefcase, MapPin, MessageSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../services/settingsService'
// Editable profile form with name, email, phone, bio fields
const fields = [
  { key: 'name', label: 'Full Name', icon: User, type: 'text', required: true, placeholder: 'John Doe' },
  { key: 'email', label: 'Email', icon: Mail, type: 'email', required: true, placeholder: 'you@example.com' },
  { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+1 (555) 000-0000' },
  { key: 'jobTitle', label: 'Job Title', icon: Briefcase, type: 'text', placeholder: 'e.g. Software Engineer' },
  { key: 'location', label: 'Location', icon: MapPin, type: 'text', placeholder: 'City, Country' },
]

function EditProfile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    bio: user?.bio || '', jobTitle: user?.jobTitle || '', location: user?.location || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (form.phone && !/^[\d\s\-+()]{7,20}$/.test(form.phone)) e.phone = 'Invalid phone number'
    if (form.bio && form.bio.length > 200) e.bio = 'Max 200 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const updated = await updateProfile({ name: form.name, email: form.email, bio: form.bio, phone: form.phone, location: form.location, jobTitle: form.jobTitle })
      setUser(updated)
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-5">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, icon: Icon, type, required, placeholder }) => (
            <div key={key} className={key === 'email' ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <div className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={type} value={form[key]} placeholder={placeholder}
                  onChange={e => { setForm({ ...form, [key]: e.target.value }); if (errors[key]) setErrors({ ...errors, [key]: '' }) }}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${errors[key] ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
                />
              </div>
              {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
          <div className="relative">
            <MessageSquare size={15} className="absolute left-3 top-3 text-slate-400" />
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." maxLength={200} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none" />
          </div>
          <div className="flex justify-between mt-1">
            {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
            <span className="text-xs text-slate-400 ml-auto">{form.bio.length}/200</span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-60 transition-colors">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default EditProfile
