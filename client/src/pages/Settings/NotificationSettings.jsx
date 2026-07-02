import { useState } from 'react'
import { Bell, Mail, Smartphone, Calendar, Brain, AlertTriangle, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePushNotifications } from '../../hooks/usePushNotifications'
import NotificationPermissionBanner from '../../components/NotificationPermissionBanner'
// Notification channels, alert types, and browser push permission management
const STORAGE_KEY = 'flowsync_notification_settings'

function loadSettings() {
  try {
    const d = localStorage.getItem(STORAGE_KEY)
    if (d) return JSON.parse(d)
  } catch { /* ignore */ }
  return {
    email: true,
    push: false,
    taskReminders: true,
    deadlineAlerts: true,
    habitReminders: true,
    aiAlerts: true,
    weeklyReport: false,
    priorityOnly: false,
  }
}

function saveSettings(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function NotificationSettings() {
  const [settings, setSettings] = useState(loadSettings)
  const { permission, subscribed, reRequestPermission } = usePushNotifications(true)
  const [requesting, setRequesting] = useState(false)

  const toggle = (key) => {
    setSettings(s => {
      const updated = { ...s, [key]: !s[key] }
      saveSettings(updated)
      toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} ${updated[key] ? 'enabled' : 'disabled'}`)
      return updated
    })
  }

  const handleReRequest = async () => {
    setRequesting(true)
    try {
      const result = await reRequestPermission()
      if (result === 'granted') toast.success('Notification permission granted!')
      else if (result === 'denied') toast.error('Permission denied — enable from browser settings')
      else toast('Permission request cancelled')
    } catch {
      toast.error('Failed to request permission')
    } finally { setRequesting(false) }
  }

  const permissionIcon = permission === 'granted' ? CheckCircle2 : permission === 'denied' ? XCircle : RefreshCw
  const permissionColor = permission === 'granted' ? 'text-emerald-600 dark:text-emerald-400' : permission === 'denied' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
  const permissionBg = permission === 'granted' ? 'bg-emerald-100 dark:bg-emerald-900/30' : permission === 'denied' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
  const permissionLabel = permission === 'granted' ? 'Allowed' : permission === 'denied' ? 'Blocked' : 'Not requested'

  const groups = [
    {
      label: 'Channels',
      icon: Bell,
      items: [
        { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
        { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications', icon: Smartphone },
      ],
    },
    {
      label: 'Alerts',
      icon: AlertTriangle,
      items: [
        { key: 'taskReminders', label: 'Task Reminders', desc: 'Get reminded about your tasks', icon: Calendar },
        { key: 'deadlineAlerts', label: 'Deadline Alerts', desc: 'Warnings when deadlines approach', icon: AlertTriangle },
        { key: 'habitReminders', label: 'Habit Reminders', desc: 'Daily habit completion prompts', icon: Brain },
        { key: 'aiAlerts', label: 'AI Alerts', desc: 'Smart suggestions from FlowSync AI', icon: Brain },
      ],
    },
    {
      label: 'Preferences',
      icon: Bell,
      items: [
        { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly productivity summary', icon: Calendar },
        { key: 'priorityOnly', label: 'Priority Only', desc: 'Only high-priority notifications', icon: AlertTriangle },
      ],
    },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notification Settings</h2>
      </div>

      <NotificationPermissionBanner permission={permission} />

      <div className="mb-6 p-4 rounded-xl border-2 border-slate-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${permissionBg} flex items-center justify-center`}>
              <Bell size={13} className={permissionColor} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Browser Notification Permission</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Status: <span className={`font-medium ${permissionColor}`}>{permissionLabel}</span></p>
            </div>
          </div>
          {permission !== 'granted' && (
            <button onClick={handleReRequest} disabled={requesting} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition disabled:opacity-50">
              {requesting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {requesting ? 'Requesting...' : 'Re-request'}
            </button>
          )}
        </div>
        {subscribed && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={10} /> Push subscription active
          </p>
        )}
        {permission === 'denied' && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Permission was blocked by your browser. Enable it from browser settings, then click "Re-request" or refresh.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {groups.map(({ label, icon: GroupIcon, items }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <GroupIcon size={13} className="text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</h3>
            </div>
            <div className="space-y-1">
              {items.map(({ key, label: itemLabel, desc, icon: ItemIcon }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      <ItemIcon size={13} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{itemLabel}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                    </div>
                  </div>
                  <button onClick={() => toggle(key)} role="switch" aria-checked={settings[key]} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${settings[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationSettings