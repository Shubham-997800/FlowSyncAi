import { memo } from 'react'
import { motion } from 'framer-motion'
import { WifiOff, AlertCircle } from 'lucide-react'
import { useOnlineStatus } from '../../pwa/useOnlineStatus'

const OfflineIndicator = memo(function OfflineIndicator() {
  const { isOnline, wasOffline, resetOfflineFlag } = useOnlineStatus()

  if (isOnline && !wasOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50" role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
          isOnline
            ? 'bg-green-500 text-white'
            : 'bg-amber-500 text-amber-900 dark:bg-amber-600 dark:text-amber-50'
        }`}
      >
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <span className="flex items-center">Connection restored</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetOfflineFlag}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Dismiss"
              >
                <AlertCircle size={14} />
              </motion.button>
            </>
          ) : (
            <>
              <WifiOff size={14} />
              <span>You're offline</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/30 dark:bg-amber-900/30">
                Some features unavailable
              </span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
})

export default OfflineIndicator