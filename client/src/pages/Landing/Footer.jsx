import { memo } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  GitFork,
  Mail,
  ArrowRight,
  LayoutDashboard,
  ListTodo,
  Brain,
  Calendar,
  Clock,
  BarChart3,
  Flame,
  Bell,
  Settings,
  Shield,
  FileText,
  Star,
} from 'lucide-react'

// App-grade landing footer: CTA strip, link columns, social, and bottom bar.
// Every link here is a real destination — internal routes, GitHub, or contact email.
const GITHUB = 'https://github.com/Shubham-997800/FlowSync-Ai'
const GITHUB_ISSUES = `${GITHUB}/issues`
const GITHUB_RELEASES = `${GITHUB}/releases`
const EMAIL = 'mailto:shubhamkumar997800@gmail.com'

const productLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks & Goals', icon: ListTodo },
  { to: '/ai-planner', label: 'AI Chat', icon: Brain },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/focus', label: 'Focus Mode', icon: Clock },
]

const resourceLinks = [
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy', icon: Shield },
  { to: '/terms', label: 'Terms & Conditions', icon: FileText },
]

const socialLinks = [
  { href: GITHUB, label: 'GitHub', icon: GitFork },
  { href: EMAIL, label: 'Email', icon: Mail },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to never miss a deadline again?</h2>
            <p className="text-indigo-100 mt-1 text-sm sm:text-base">Join FlowSync AI — plan smarter, focus better, finish faster.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.97]"
            >
              Start Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-[0.97]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              <img src="/favicon.svg" alt="" width={26} height={26} className="rounded-[7px] shrink-0" />
              FlowSync AI
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              An AI-powered productivity platform that helps you plan smarter, focus better, and never miss a deadline.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              All systems operational
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">Connect</p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-colors"
                  >
                    <Icon size={17} />
                  </a>
                ))}
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Star size={14} /> Star on GitHub
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Icon size={14} className="opacity-60 group-hover:opacity-100" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Icon size={14} className="opacity-60 group-hover:opacity-100" /> {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={GITHUB_ISSUES} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
              </li>
              {legalLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Icon size={14} className="opacity-60 group-hover:opacity-100" /> {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={EMAIL} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">&copy; {year} FlowSync AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="/terms" className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">GitHub</a>
            <a href={GITHUB_RELEASES} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:underline">v3.11</a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 inline-flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> by Shubham Dangi
          </p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
