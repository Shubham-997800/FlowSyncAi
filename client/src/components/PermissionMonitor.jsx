import { useState, useEffect, useCallback } from 'react'
import { Bell, Mic, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react'

// Status indicator for notification and microphone permissions
function usePermission(name) {
  const [state, setState] = useState('prompt')

  useEffect(() => {
    let status = null
    const check = async () => {
      try {
        if (name === 'notifications') {
          setState(Notification.permission)
          return
        }
        status = await navigator.permissions.query({ name })
        setState(status.state)
        status.addEventListener('change', () => setState(status.state))
      } catch {
        setState('unsupported')
      }
    }
    check()
    return () => status?.removeEventListener('change', () => {})
  }, [name])

  return state
}

function PermissionIcon({ state }) {
  if (state === 'granted') return <ShieldCheck size={14} className="text-emerald-500" />
  if (state === 'denied') return <ShieldX size={14} className="text-red-500" />
  return <ShieldAlert size={14} className="text-amber-500" />
}

function PermissionMonitor() {
  const notifPerm = usePermission('notifications')
  const micPerm = usePermission('microphone')
  const [open, setOpen] = useState(false)

  const allGranted = notifPerm === 'granted' && micPerm === 'granted'
  const anyDenied = notifPerm === 'denied' || micPerm === 'denied'

  if (allGranted) return null

  const badgeColor = anyDenied ? 'bg-red-500' : 'bg-amber-500'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors relative"
        title="Permission status"
      >
        <ShieldAlert size={16} />
        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${badgeColor} ring-2 ring-white dark:ring-zinc-900`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-lg z-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Notifications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PermissionIcon state={notifPerm} />
                  <span className={`text-xs font-medium ${
                    notifPerm === 'granted' ? 'text-emerald-600 dark:text-emerald-400' :
                    notifPerm === 'denied' ? 'text-red-600 dark:text-red-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`}>{notifPerm}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic size={14} className="text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Microphone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PermissionIcon state={micPerm} />
                  <span className={`text-xs font-medium ${
                    micPerm === 'granted' ? 'text-emerald-600 dark:text-emerald-400' :
                    micPerm === 'denied' ? 'text-red-600 dark:text-red-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`}>{micPerm}</span>
                </div>
              </div>
              {anyDenied && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  Some permissions are blocked. Allow them in your browser settings for full functionality.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PermissionMonitor
