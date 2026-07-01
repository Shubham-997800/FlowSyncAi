import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Settings as SettingsIcon, LogOut, Camera, TrendingUp, X, Loader2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import UserStats from './UserStats'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../../services/taskService'
import { uploadAvatar as uploadAvatarApi } from '../../services/settingsService'
// Main profile page with avatar upload, stats chart, edit and password tabs
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

const tabs = [
  { key: 'overview', label: 'Overview', icon: TrendingUp },
  { key: 'edit', label: 'Edit Profile', icon: User },
  { key: 'password', label: 'Password', icon: Lock },
]

function Profile() {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [avatar, setAvatar] = useState(user?.profilePicture || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const updated = await uploadAvatarApi(e.target.result)
        setAvatar(e.target.result)
        setUser(updated)
        toast.success('Avatar updated')
      } catch { toast.error('Failed to upload avatar') }
      finally { setUploading(false) }
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = async () => {
    setUploading(true)
    try {
      const updated = await uploadAvatarApi(null)
      setAvatar(null)
      setUser(updated)
      toast.success('Avatar removed')
    } catch { toast.error('Failed to remove avatar') }
    finally { setUploading(false) }
  }

  return (
    <motion.div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Profile - FlowSync AI</title>
        <meta name="description" content="Manage your personal information" />
      </Helmet>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/settings')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm font-medium transition-colors">
            <SettingsIcon size={16} /> Settings
          </button>
          <button onClick={() => { logout(); toast.success('Logged out'); navigate('/') }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6">
            <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="px-6 pb-6 -mt-10">
              <div className="relative w-20 h-20 mx-auto mb-3 group">
                <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-zinc-900">
                  {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <User size={32} className="text-indigo-600 dark:text-indigo-400" />}
                  {uploading && <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center"><Loader2 size={20} className="animate-spin text-white" /></div>}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                {avatar && (
                  <button onClick={removeAvatar} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100">
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'User'}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                {user?.jobTitle && <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium">{user.jobTitle}</span>}
                {user?.location && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">{user.location}</p>}
                {user?.bio && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic leading-relaxed">"{user.bio}"</p>}
              </div>
            </div>
            <nav className="px-4 pb-4 space-y-1">
              {tabs.map(t => {
                const Icon = t.icon
                return (
                  <motion.button key={t.key} variants={itemVariants} onClick={() => setTab(t.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    <Icon size={16} /> {t.label}
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {tab === 'overview' && <><UserStats /><RecentActivity /></>}
          {tab === 'edit' && <EditProfile />}
          {tab === 'password' && <ChangePassword />}
        </div>
      </div>
    </motion.div>
  )
}

function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        const tasks = Array.isArray(data) ? data : []
        const items = tasks.filter(t => t.deadline).sort((a, b) => new Date(b.deadline) - new Date(a.deadline)).slice(0, 10).map(t => ({
          id: t._id,
          text: t.title,
          type: t.status === 'done' ? 'completed' : t.status === 'in-progress' ? 'in-progress' : 'pending',
          date: t.deadline ? new Date(t.deadline).toLocaleDateString() : '',
          priority: t.priority || 'medium',
        }))
        setActivities(items)
      } catch { setActivities([]) }
      finally { setLoading(false) }
    }
    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No recent activity yet</p>
      ) : (
        <div className="space-y-1">
          {activities.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'completed' ? 'bg-emerald-500' : a.type === 'in-progress' ? 'bg-blue-500' : a.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
              <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 min-w-0 truncate">{a.text}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
                a.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                a.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
              }`}>{a.priority}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{a.date}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
