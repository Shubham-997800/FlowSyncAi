import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, Trash2, Download, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { updateProfile, deleteAccount as deleteAccountApi } from '../../services/settingsService'
import { getTasks } from '../../services/taskService'
import { getGoals } from '../../services/goalService'
import { getHabits } from '../../services/habitService'

function AccountSettings() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const [tasks, goals, habits] = await Promise.all([
        getTasks().catch(() => []),
        getGoals().catch(() => []),
        getHabits().catch(() => []),
      ])
      const data = {
        exportedAt: new Date().toISOString(),
        tasks,
        goals,
        habits,
        focusSessions: parseInt(localStorage.getItem('flowsync_focus_sessions') || '0'),
        focusMinutes: parseInt(localStorage.getItem('flowsync_focus_minutes') || '0'),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `flowsync_export_${new Date().toISOString().split('T')[0]}.json`; a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch {
      toast.error('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  const handleClearData = () => {
    const keys = ['flowsync_tasks', 'flowsync_goals', 'flowsync_habits', 'flowsync_notifications', 'flowsync_focus_sessions', 'flowsync_focus_minutes']
    keys.forEach(k => localStorage.removeItem(k))
    toast.success('All data cleared')
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountApi()
      toast.success('Account deleted')
      logout()
      navigate('/')
    } catch {
      toast.error('Failed to delete account')
    }
  }

  const handleLogoutAll = () => {
    toast.success('Logged out of all devices (demo)')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Download size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data & Privacy</h2>
        </div>

        <div className="space-y-3">
          <button onClick={handleExport} disabled={exporting} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200 disabled:opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                {exporting ? <Loader2 size={13} className="text-indigo-500 animate-spin" /> : <Download size={13} className="text-slate-500" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{exporting ? 'Exporting...' : 'Export Data'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Download your tasks, goals & habits as JSON</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">&rarr;</span>
          </button>

          <button onClick={handleLogoutAll} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                <EyeOff size={13} className="text-slate-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Logout All Devices</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Sign out everywhere except this device</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">&rarr;</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Shield size={16} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Danger Zone</h2>
        </div>

        <div className="space-y-3">
          <button onClick={handleClearData} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={13} className="text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Clear All Data</p>
                <p className="text-[10px] text-red-500 dark:text-red-400">Remove all app data from this browser</p>
              </div>
            </div>
            <span className="text-xs text-red-400">&rarr;</span>
          </button>

          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 size={13} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Delete Account</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400">Permanently delete your account and all data</p>
                </div>
              </div>
              <span className="text-xs text-red-400">&rarr;</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-3">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors duration-200">Yes, delete my account</button>
                <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors duration-200">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
