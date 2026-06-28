import { useState } from 'react'
import { Bell, Mail, Smartphone, Calendar, Brain, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    taskReminders: true,
    deadlineAlerts: true,
    habitReminders: true,
    aiAlerts: true,
    weeklyReport: false,
    priorityOnly: false,
  })

  const toggle = (key) => {
    setSettings(s => {
      const updated = { ...s, [key]: !s[key] }
      toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} ${updated[key] ? 'enabled' : 'disabled'}`)
      return updated
    })
  }

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

      <div className="space-y-6">
        {groups.map(({ label, icon: GroupIcon, items }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <GroupIcon size={13} className="text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</h3>
            </div>
            <div className="space-y-1">
              {items.map(({ key, label: itemLabel, desc, icon: ItemIcon }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      <ItemIcon size={13} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{itemLabel}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                    </div>
                  </div>
                  <button onClick={() => toggle(key)} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${settings[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
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
