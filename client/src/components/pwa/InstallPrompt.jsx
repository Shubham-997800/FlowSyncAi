import { useEffect, memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { usePWAInstall } from '../../pwa/usePWAInstall'

const InstallPrompt = memo(function InstallPrompt({ placement = 'banner' }) {
  const { canInstall, isInstalled, isIOS, install, dismiss, shouldShowInstall } = usePWAInstall()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!shouldShowInstall || isInstalled) return
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled) {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed || Date.now() - parseInt(dismissed, 10) > 7 * 24 * 60 * 60 * 1000) {
          setShow(true)
        }
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [canInstall, isInstalled, shouldShowInstall])

  if (!shouldShowInstall || isInstalled || !show) return null

  const icon = isIOS ? <Smartphone size={20} /> : <Monitor size={20} />

  const handleInstall = async () => {
    const result = await install()
    if (result.success) {
      setShow(false)
    }
  }

  const handleDismiss = () => {
    dismiss()
    setShow(false)
  }

  if (placement === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Install FlowSync AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Get a faster, distraction-free experience with offline access.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download size={14} /> Install
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDismiss}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Install FlowSync AI</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Get a faster, distraction-free experience with offline access.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Download size={14} /> Install
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDismiss}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default InstallPrompt