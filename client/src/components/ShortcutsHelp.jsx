import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { NAV_ORDER } from '../hooks/useNavigation'

const groups = [
  {
    title: 'Page Navigation',
    rows: [
      { keys: ['←', '→'], desc: 'Previous / next page' },
      { keys: ['?'], desc: 'Show this help' },
    ],
  },
  {
    title: 'Jump to page (number keys)',
    rows: NAV_ORDER.map(n => ({ keys: [n.key], desc: n.label })),
  },
]

function ShortcutsHelp({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Keyboard size={15} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              {groups.map(g => (
                <div key={g.title}>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">{g.title}</p>
                  <div className="space-y-1.5">
                    {g.rows.map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</span>
                        <span className="flex gap-1">
                          {r.keys.map((k, j) => (
                            <kbd key={j} className="min-w-[24px] px-1.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 text-center">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[11px] text-slate-400 dark:text-slate-500">Tip: on mobile you can swipe left/right to switch pages, and swipe from the left edge to open the menu.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ShortcutsHelp
