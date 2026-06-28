import { useState } from 'react'
import { Palette, Bell, Brain, Shield } from 'lucide-react'
import ThemeSettings from './ThemeSettings'
import NotificationSettings from './NotificationSettings'
import AISettings from './AISettings'
import AccountSettings from './AccountSettings'

const sidebarItems = [
  { key: 'theme', label: 'Theme', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'ai', label: 'AI Preferences', icon: Brain },
  { key: 'account', label: 'Account', icon: Shield },
]

function Settings() {
  const [tab, setTab] = useState('theme')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Control how FlowSync AI works for you</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-3">
            <nav className="space-y-1">
              {sidebarItems.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${tab === key ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          {tab === 'theme' && <ThemeSettings />}
          {tab === 'notifications' && <NotificationSettings />}
          {tab === 'ai' && <AISettings />}
          {tab === 'account' && <AccountSettings />}
        </div>
      </div>
    </div>
  )
}

export default Settings
