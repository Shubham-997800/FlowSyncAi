import { useEffect, memo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, X, AlertCircle } from 'lucide-react'

const UpdatePrompt = memo(function UpdatePrompt() {
  const [show, setShow] = useState(false)
  const [registration, setRegistration] = useState(null)

  const handleUpdate = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    } else {
      window.location.reload()
    }
  }, [registration])

  const handleLater = useCallback(() => {
    setShow(false)
  }, [])

  useEffect(() => {
    const handleSWUpdate = (e) => {
      setRegistration(e.detail)
      setShow(true)
    }

    window.addEventListener('sw-update-available', handleSWUpdate)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (navigator.serviceWorker.controller) {
          window.location.reload()
        }
      })
    }

    return () => {
      window.removeEventListener('sw-update-available', handleSWUpdate)
    }
  }, [])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
    >
      <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 rounded-2xl shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Update Available</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              A new version of FlowSync AI is ready. Refresh to get the latest features.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                <RefreshCw size={14} /> Update Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLater}
                className="px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
              >
                Later
              </motion.button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLater}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
})

export default UpdatePrompt