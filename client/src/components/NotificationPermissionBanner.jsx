import { useState, useEffect } from 'react'
import { Bell, BellOff, X, ExternalLink, Smartphone, Settings as SettingsIcon } from 'lucide-react'

// Banner alerting users when browser notifications are blocked
const browserInstructions = {
  chrome: 'Settings → Privacy & Security → Site Settings → Notifications → Allow',
  edge: 'Settings → Cookies & Site Permissions → Notifications → Allow',
  firefox: 'Options → Privacy & Security → Permissions → Notifications → Settings → Allow',
  safari: 'Preferences → Websites → Notifications → Allow',
  default: 'Browser settings → Notifications → Allow for this site',
}

function getBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('chrome') && !ua.includes('edge')) return 'chrome'
  if (ua.includes('edge')) return 'edge'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari')) return 'safari'
  return 'default'
}

function NotificationPermissionBanner({ permission, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (permission === 'granted') setDismissed(true)
    else if (permission === 'denied') setDismissed(false)
    else setDismissed(true)
  }, [permission])

  if (dismissed || permission !== 'denied') return null

  const browser = getBrowser()
  const instructions = browserInstructions[browser] || browserInstructions.default

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BellOff size={16} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Notifications are blocked</h3>
            <button onClick={handleDismiss} className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition flex-shrink-0">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
            You won't receive deadline alerts, task reminders, or AI suggestions as notifications.
          </p>
          <button onClick={() => setShowDetails(!showDetails)} className="text-xs font-medium text-amber-700 dark:text-amber-300 underline hover:no-underline flex items-center gap-1">
            <ExternalLink size={10} /> {showDetails ? 'Hide instructions' : 'How to enable'}
          </button>
          {showDetails && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
              <div className="flex items-center gap-1.5 mb-1.5">
                <SettingsIcon size={11} className="text-amber-600 dark:text-amber-400" />
                <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 capitalize">{browser}</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">{instructions}</p>
              <p className="text-[10px] text-amber-500 dark:text-amber-500 mt-1">After enabling, refresh the page to activate notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationPermissionBanner