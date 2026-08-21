import { useState, useEffect, useCallback } from 'react'
import { Monitor, Smartphone, Tablet, Loader2, LogOut, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const deviceIcon = (os) => {
  if (/android|ios/i.test(os)) return Smartphone
  if (/tablet/i.test(os)) return Tablet
  return Monitor
}

const fmtDate = (d) => {
  try { return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) } catch { return '—' }
}

// Lists the signed-in user's active device sessions. Supports revoking a
// single device and signing out every other device.
function ActiveSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revokingId, setRevokingId] = useState(null)

  const fetchSessions = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/sessions')
      setSessions(Array.isArray(data) ? data : [])
    } catch {
      setError('Unable to load your devices right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchSessions, 0)
    return () => clearTimeout(timer)
  }, [fetchSessions])

  const reload = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/sessions')
      setSessions(Array.isArray(data) ? data : [])
      setError('')
    } catch {
      setError('Unable to load your devices right now.')
    }
  }, [])

  const revoke = async (id) => {
    setRevokingId(id)
    try {
      const { data } = await api.delete(`/api/auth/sessions/${id}`)
      toast.success(data?.current ? 'This device was signed out' : 'Device signed out')
      if (data?.current) {
        window.location.assign('/login')
        return
      }
      setSessions(prev => prev.filter(s => s._id !== id))
    } catch {
      toast.error('Could not sign out that device')
    } finally {
      setRevokingId(null)
    }
  }

  const logoutOthers = async () => {
    try {
      const { data } = await api.post('/api/auth/sessions/logout-others')
      toast.success(`${data?.revoked ?? 0} other device(s) signed out`)
      reload()
    } catch {
      toast.error('Could not sign out other devices')
    }
  }

  const othersCount = sessions.filter(s => !s.current).length

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Monitor size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Active Devices</h2>
        </div>
        {othersCount > 0 && (
          <button onClick={logoutOthers} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <LogOut size={12} /> Sign out others ({othersCount})
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-slate-400" /></div>
      )}

      {!loading && error && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error}</p>
          <button onClick={reload} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">Retry</button>
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No active devices found.</p>
      )}

      {!loading && !error && sessions.length > 0 && (
        <ul className="space-y-2">
          {sessions.map(s => {
            const Icon = deviceIcon(s.os)
            return (
              <li key={s._id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {s.device || 'Unknown device'}
                      {s.current && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">This device</span>}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{s.os} · Last active {fmtDate(s.lastActive)}</p>
                  </div>
                </div>
                <button
                  onClick={() => revoke(s._id)}
                  disabled={revokingId === s._id}
                  aria-label={`Sign out ${s.device}`}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  {revokingId === s._id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ActiveSessions
