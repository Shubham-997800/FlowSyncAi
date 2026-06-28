import { GitBranch, Globe } from 'lucide-react'

const quickLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#' },
  { label: 'FAQ', href: '#' },
]

const legal = [
  { label: 'GitHub', href: 'https://github.com/Shubham-997800/FlowSync-Ai', icon: GitBranch },
  { label: 'Privacy Policy', href: '#', icon: Globe },
  { label: 'Terms', href: '#', icon: Globe },
  { label: 'Contact', href: '#', icon: Globe },
]

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold text-emerald-600">FlowSync AI</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your AI Productivity Companion</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {legal.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  <Icon size={14} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500">
          &copy; 2026 FlowSync AI. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
