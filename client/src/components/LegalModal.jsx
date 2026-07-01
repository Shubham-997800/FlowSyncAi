import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Modal for displaying Terms & Conditions or Privacy Policy
const content = {
  terms: {
    title: 'Terms & Conditions',
    sections: [
      { h: '1. Acceptance', p: 'By creating an account or using FlowSync AI, you accept these Terms and our Privacy Policy.' },
      { h: '2. Account', p: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information.' },
      { h: '3. Use', p: 'FlowSync AI is a productivity tool. You agree not to misuse the platform for any unlawful purpose.' },
      { h: '4. Data', p: 'We store your task, goal, and habit data to provide our services. See our Privacy Policy for details.' },
      { h: '5. Termination', p: 'We reserve the right to suspend or terminate accounts that violate these terms.' },
    ],
    footer: 'Last updated: June 2026',
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { h: '1. Data Collection', p: 'We collect your name, email, and productivity data (tasks, goals, habits) to provide our AI-powered planning services.' },
      { h: '2. Data Storage', p: 'Your data is stored securely in MongoDB Atlas with encryption. We do not share your personal data with third parties.' },
      { h: '3. AI Processing', p: 'Task and schedule data may be processed through AI to provide planning suggestions. No personal identifiers are sent.' },
      { h: '4. Your Rights', p: 'You can access, modify, or delete your data anytime through your account settings or by contacting us.' },
      { h: '5. Contact', p: 'For privacy concerns, reach out through our support channels.' },
    ],
    footer: 'Last updated: June 2026',
  },
}

function LegalModal({ type, onClose }) {
  const data = content[type]
  if (!data) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl border border-slate-200 dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{data.title}</h2>
            <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
          <div className="px-6 py-4 space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.sections.map((s) => (
              <div key={s.h}>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
            <p className="text-xs text-slate-400 pt-2">{data.footer}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default memo(LegalModal)
