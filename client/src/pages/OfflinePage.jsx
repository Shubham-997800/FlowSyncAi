import { useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCw, Smartphone, Monitor, ArrowLeft } from 'lucide-react'
import { useOnlineStatus } from '../pwa/useOnlineStatus'

const OfflinePage = memo(function OfflinePage() {
  const { isOnline, resetOfflineFlag } = useOnlineStatus()

  useEffect(() => {
    if (isOnline) {
      resetOfflineFlag()
      window.location.href = '/dashboard'
    }
  }, [isOnline, resetOfflineFlag])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"
        >
          <WifiOff size={40} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3"
        >
          You're Offline
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed"
        >
          FlowSync AI is currently unable to connect to the internet. Previously loaded content may still be available, but AI features and real-time sync require a connection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Try Again</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800"
        >
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">When online, FlowSync AI works as a standalone app</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Smartphone size={14} /> Mobile
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Monitor size={14} /> Desktop
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
})

export default OfflinePage