import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Info, RefreshCw, CheckCircle2, Download } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import ErrorBoundary from '../../components/ErrorBoundary'
import { APP_VERSION, BUILD_DATE, checkForUpdates } from '../../utils/version'

function AboutSettings() {
  const [status, setStatus] = useState('idle') // idle | checking | latest | available | error
  const [error, setError] = useState('')

  const handleCheck = useCallback(async () => {
    setStatus('checking')
    setError('')
    try {
      const result = await checkForUpdates()
      if (!result.supported) {
        // No service worker (e.g. plain browser tab on first visit):
        // a hard reload always fetches the newest deployment.
        setStatus('latest')
        return
      }
      setStatus(result.updated ? 'available' : 'latest')
    } catch {
      setError('Could not check for updates. Check your connection and try again.')
      setStatus('error')
    }
  }, [])

  const handleUpdateNow = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      }, { once: true })
    }
    window.location.reload()
  }, [])

  return (
    <div className="space-y-6">
      <Helmet>
        <title>About - FlowSync AI</title>
      </Helmet>
      <ErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Info size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Application</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Version information and updates</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-4">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Application Version</dt>
              <dd className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">v{APP_VERSION}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-4">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Build Date</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-2">
                {BUILD_DATE ? new Date(BUILD_DATE).toLocaleString() : '—'}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheck}
              disabled={status === 'checking'}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={15} className={status === 'checking' ? 'animate-spin' : ''} />
              {status === 'checking' ? 'Checking…' : 'Check for Updates'}
            </motion.button>

            {status === 'latest' && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={16} /> You&apos;re using the latest version.
              </motion.span>
            )}
            {status === 'available' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">🎉 Update available — reload to apply.</span>
                <button onClick={handleUpdateNow} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors">
                  <Download size={14} /> Update Now
                </button>
              </motion.div>
            )}
            {status === 'error' && (
              <span className="text-sm text-rose-600 dark:text-rose-400">{error}</span>
            )}
          </div>
        </motion.div>
      </ErrorBoundary>
    </div>
  )
}

export default AboutSettings
