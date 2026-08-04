import { motion, AnimatePresence } from 'framer-motion'
import { Laptop, Smartphone, Tablet, X, Check, Keyboard, Hand, Mic, BellRing, Menu, MonitorSmartphone } from 'lucide-react'
import { detectDevice } from '../utils/device'

const desktopFeatures = [
  { icon: Keyboard, title: 'Keyboard shortcuts', desc: 'Press 1-9 to jump to any page, ← → to switch pages, and ? for the full shortcut list.' },
  { icon: MonitorSmartphone, title: 'Always-visible sidebar', desc: 'Navigate instantly from the sidebar. Hover items for quick context and badge previews.' },
  { icon: BellRing, title: 'Multi-tasking', desc: 'Switch between Dashboard, Calendar, Tasks and AI Chat without losing your work.' },
  { icon: Check, title: 'AI quality control', desc: 'Pick Fast, Balanced or Smart AI from the AI Chat header or Settings to match your needs.' },
]

const mobileFeatures = [
  { icon: Hand, title: 'Swipe navigation', desc: 'Swipe left or right on any page to move to the previous or next section.' },
  { icon: Menu, title: 'Menu via hamburger', desc: 'Tap the menu icon (top-left) to open the sidebar, or swipe in from the left edge.' },
  { icon: Mic, title: 'Voice input in AI Chat', desc: 'Tap the mic button and speak — the AI understands Hindi, Hinglish and English.' },
  { icon: BellRing, title: 'Push notifications', desc: 'Get deadline reminders right on your phone. Tap a notification to jump to the task.' },
]

const tabletFeatures = [
  { icon: Hand, title: 'Swipe navigation', desc: 'Swipe left/right to switch pages, or use the sidebar on the left.' },
  { icon: Keyboard, title: 'Keyboard shortcuts', desc: 'Connect a keyboard and press 1-9 to jump, ← → to switch, ? for help.' },
  { icon: Mic, title: 'Voice input in AI Chat', desc: 'Use the mic button to speak your tasks in Hindi, Hinglish or English.' },
  { icon: BellRing, title: 'Push notifications', desc: 'Stay on top of deadlines with notifications on your tablet.' },
]

function DeviceOnboarding({ open, onClose }) {
  const device = detectDevice()
  const features = device.type === 'tablet' ? tabletFeatures : device.isMobile ? mobileFeatures : desktopFeatures
  const DeviceIcon = device.type === 'tablet' ? Tablet : device.isMobile ? Smartphone : Laptop
  const deviceName = device.type === 'tablet' ? 'Tablet' : device.isMobile ? 'Phone' : 'Laptop / Desktop'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <DeviceIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">Welcome to FlowSync AI</h2>
                    <p className="text-xs text-indigo-100 mt-0.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
                        <DeviceIcon size={10} /> {deviceName} detected
                      </span>
                      <span>{device.os} · {device.browser}</span>
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Here's how to get the most out of FlowSync AI on your {deviceName.toLowerCase()}:
              </p>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <f.icon size={15} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{f.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-200/40 dark:shadow-indigo-900/40">
                Got it, let's go
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DeviceOnboarding
