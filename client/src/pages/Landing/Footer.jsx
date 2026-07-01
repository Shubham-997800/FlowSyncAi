import { useState, memo } from 'react'
import { Shield, FileText } from 'lucide-react'
import Modal from '../../components/ui/Modal'

const quickLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
]

const legalLinks = [
  { label: 'Privacy Policy', icon: Shield, modal: 'privacy' },
  { label: 'Terms of Service', icon: FileText, modal: 'terms' },
]

function Footer() {
  const year = new Date().getFullYear()
  const [modal, setModal] = useState(null)

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</span>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              An AI-powered productivity platform that helps you plan smarter, focus better, and never miss a deadline.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map(({ label, icon: Icon, modal: m }) => (
                <li key={label}>
                  <button onClick={() => setModal(m)} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 cursor-pointer">
                    <Icon size={14} /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">&copy; {year} FlowSync AI. All rights reserved.</p>
        </div>
      </div>

      <Modal isOpen={modal === 'privacy'} onClose={() => setModal(null)} title="Privacy Policy">
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
          <p className="text-xs text-slate-500">Last updated: July 2026</p>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">1. Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Account Data: Name, email address, and hashed password (bcrypt, 10 salt rounds)</li>
              <li>Productivity Data: Tasks, goals, habits, focus sessions, chat messages, and calendar events</li>
              <li>Profile Data: Optional bio, phone number, location, job title, and profile picture</li>
              <li>Usage Data: Page views, feature interactions, and session duration (anonymized)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">2. How We Use Your Data</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>AI Processing: Your tasks and schedule data are sent to OpenRouter AI for planning and prioritization — no personal identifiers are included in AI requests</li>
              <li>Productivity Analytics: We aggregate your completion rates, focus patterns, and habit streaks to generate insights</li>
              <li>Service Improvement: Anonymized usage patterns help us optimize features and UI</li>
              <li>Communication: Password reset emails via SMTP (your email is never shared with third parties)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">3. Data Storage & Security</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Encryption at rest via MongoDB Atlas (AES-256)</li>
              <li>Encryption in transit via HTTPS/TLS 1.3</li>
              <li>Passwords are hashed with bcryptjs (never stored in plaintext)</li>
              <li>JWT tokens expire after 30 days; refresh requires re-login</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">4. Your Rights</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Right to Access, Rectify, and Delete your data</li>
              <li>Right to Data Portability (export tasks as CSV)</li>
              <li>Right to Withdraw Consent (toggle AI features in Settings)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">5. Contact</h3>
            <p className="text-xs">Developer: Shubham Dangi &middot; Email: shubhamkumar997800@gmail.com</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'terms'} onClose={() => setModal(null)} title="Terms & Conditions">
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>Welcome to FlowSync AI. By using our platform, you agree to these terms.</p>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">1. Acceptance</h3>
            <p className="text-xs mt-1">By creating an account or using FlowSync AI, you accept these Terms and our Privacy Policy.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">2. Account</h3>
            <p className="text-xs mt-1">You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">3. Use</h3>
            <p className="text-xs mt-1">FlowSync AI is a productivity tool. You agree not to misuse the platform for any unlawful purpose.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">4. Data</h3>
            <p className="text-xs mt-1">We store your task, goal, and habit data to provide our services. See our Privacy Policy for details.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">5. Termination</h3>
            <p className="text-xs mt-1">We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </div>
          <p className="text-xs text-slate-400 pt-2">Last updated: June 2026</p>
        </div>
      </Modal>
    </footer>
  )
}

export default memo(Footer)
