import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, User, Bell, Shield, Trash2, LogOut, Calendar, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [notifyTasks, setNotifyTasks] = useState(true)
  const [notifyDeadlines, setNotifyDeadlines] = useState(true)
  const [notifyHabits, setNotifyHabits] = useState(true)
  const [googleSync, setGoogleSync] = useState(false)

  const handleSaveProfile = (e) => { e.preventDefault(); toast.success('Profile updated') }

  const handleClearData = () => {
    const keys = ['flowsync_tasks', 'flowsync_goals', 'flowsync_habits', 'flowsync_notifications', 'flowsync_focus_sessions']
    keys.forEach(k => localStorage.removeItem(k))
    toast.success('All app data cleared')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input value={email} disabled className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed" />
            </div>
            <button type="submit" className="bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">Save Changes</button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              {dark ? <Sun size={20} className="text-purple-600 dark:text-purple-400" /> : <Moon size={20} className="text-purple-600 dark:text-purple-400" />}
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
          </div>
          <div className="flex items-center justify-between max-w-md">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark themes</p>
            </div>
            <button onClick={toggle} className={`relative w-12 h-6 rounded-full transition ${dark ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition ${dark ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Bell size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notification Preferences</h2>
          </div>
          <div className="space-y-3 max-w-md">
            {[
              { key: 'tasks', label: 'Task Reminders', desc: 'Get notified about upcoming and overdue tasks', state: notifyTasks, set: setNotifyTasks },
              { key: 'deadlines', label: 'Deadline Alerts', desc: 'Receive warnings when deadlines are approaching', state: notifyDeadlines, set: setNotifyDeadlines },
              { key: 'habits', label: 'Habit Reminders', desc: 'Daily reminders to complete your habits', state: notifyHabits, set: setNotifyHabits },
            ].map(({ key, label, desc, state, set }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
                <button onClick={() => set(!state)} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${state ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${state ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Calendar size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Integrations</h2>
          </div>
          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <ExternalLink size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Google Calendar Sync</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sync your tasks with Google Calendar</p>
                </div>
              </div>
              <button onClick={() => { setGoogleSync(!googleSync); toast.success(googleSync ? 'Google Calendar disconnected' : 'Google Calendar connected (demo)') }} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${googleSync ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${googleSync ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-red-200 dark:border-red-900/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <Shield size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleClearData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <Trash2 size={16} /> Clear All Data
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
