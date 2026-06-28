import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import AvatarUpload from './AvatarUpload'
import UserStats from './UserStats'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [avatar, setAvatar] = useState(null)

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'edit', label: 'Edit Profile' },
    { key: 'password', label: 'Password' },
    { key: 'avatar', label: 'Avatar' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/settings')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm font-medium transition-colors duration-200">
            <SettingsIcon size={16} /> Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition-colors duration-200">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-3 overflow-hidden">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <User size={32} className="text-indigo-600 dark:text-indigo-400" />}
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'User'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              <span className="mt-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium">{user?.role || 'Student'}</span>
            </div>
            <nav className="space-y-1">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${tab === t.key ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>{t.label}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {tab === 'overview' && (
            <>
              <UserStats />
              <RecentActivity />
            </>
          )}
          {tab === 'edit' && <EditProfile />}
          {tab === 'password' && <ChangePassword />}
          {tab === 'avatar' && <AvatarUpload avatar={avatar} setAvatar={setAvatar} />}
        </div>
      </div>
    </div>
  )
}

function RecentActivity() {
  const [activities] = useState(() => {
    try {
      const tasks = JSON.parse(localStorage.getItem('flowsync_tasks') || '[]')
      return tasks
        .filter(t => t.dueDate)
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
        .slice(0, 10)
        .map(t => ({
          id: t.id,
          text: t.title,
          type: t.completed ? 'completed' : 'pending',
          date: t.dueDate,
        }))
    } catch { return [] }
  })

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No recent activity yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
      <div className="space-y-2">
        {activities.map(a => (
          <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 min-w-0 truncate">{a.text}</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{a.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
