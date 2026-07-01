import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Database, Eye, Mail, Lock, Cookie, Scale, Trash2 } from 'lucide-react'

const sections = [
  {
    icon: Shield,
    title: '1. Information We Collect',
    content: [
      'Account Data: Name, email address, and hashed password (bcrypt, 10 salt rounds)',
      'Productivity Data: Tasks, goals, habits, focus sessions, chat messages, and calendar events',
      'Profile Data: Optional bio, phone number, location, job title, and profile picture',
      'Usage Data: Page views, feature interactions, and session duration (anonymized)',
    ],
  },
  {
    icon: Database,
    title: '2. How We Use Your Data',
    content: [
      'AI Processing: Your tasks and schedule data are sent to OpenRouter AI (Llama, GPT-4o-mini, Claude) to generate plans, prioritization, and suggestions — no personal identifiers (name/email) are included in AI requests',
      'Productivity Analytics: We aggregate your completion rates, focus patterns, and habit streaks to generate insights',
      'Service Improvement: Anonymized usage patterns help us optimize features and UI',
      'Communication: Password reset emails via SMTP (your email is never shared with third parties)',
    ],
  },
  {
    icon: Lock,
    title: '3. Data Storage & Security',
    content: [
      'Encryption at rest via MongoDB Atlas (AES-256)',
      'Encryption in transit via HTTPS/TLS 1.3',
      'Passwords are hashed with bcryptjs (never stored in plaintext)',
      'JWT tokens expire after 30 days; refresh requires re-login',
      'Rate limiting (5-100 req/min per endpoint) prevents abuse',
      'All secrets stored in environment variables — never in code',
    ],
  },
  {
    icon: Eye,
    title: '4. AI Processing & Third-Party Services',
    content: [
      'AI Provider: OpenRouter (openrouter.ai) — processes task titles, descriptions, and deadlines for planning/prioritization',
      'Hosting: Vercel (frontend) and Railway (backend) — standard cloud infrastructure',
      'Database: MongoDB Atlas — cloud database with automated backups',
      'Email: SMTP provider of your choice (default: Ethereal for testing)',
      'We do NOT sell, rent, or share your personal data with advertisers or data brokers',
    ],
  },
  {
    icon: Cookie,
    title: '5. Cookies & Local Storage',
    content: [
      'Local Storage: Theme preference (light/dark/system), focus session counters, and auth state',
      'No third-party cookies are used',
      'No tracking scripts, analytics cookies, or fingerprinting',
      'JWT token is stored in memory (not localStorage) for security',
    ],
  },
  {
    icon: Trash2,
    title: '6. Data Retention & Deletion',
    content: [
      'Active accounts: Data retained until account deletion',
      'Account deletion: All user data (tasks, goals, habits, notifications, chat history) is permanently deleted within 24 hours',
      'AI chat history: Limited to 6 most recent sessions per user; oldest sessions auto-purged',
      'Daily AI usage counters reset every 24 hours',
      'You can delete your account anytime via Settings or by contacting the developer',
    ],
  },
  {
    icon: Scale,
    title: '7. Your Rights',
    content: [
      'Right to Access: View all your data via the dashboard and settings pages',
      'Right to Rectify: Edit your profile, tasks, and preferences anytime',
      'Right to Deletion: Delete individual items or your entire account',
      'Right to Data Portability: Export tasks as CSV from the Analytics page',
      'Right to Withdraw Consent: Toggle AI features on/off in AI Settings',
      'To exercise any right, contact the developer at shubhamkumar997800@gmail.com',
    ],
  },
  {
    icon: Mail,
    title: '8. Contact',
    content: [
      'Developer: Shubham Dangi',
      'Email: shubhamkumar997800@gmail.com',
      'GitHub: https://github.com/Shubham-997800',
      'LinkedIn: https://linkedin.com/in/shubham997800',
      'Response time: Within 48 hours',
    ],
  },
]

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: July 2026</p>

        <div className="space-y-6">
          {sections.map(({ icon: Icon, title, content }) => (
            <div key={title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Icon size={15} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
              </div>
              <ul className="space-y-1.5">
                {content.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            This privacy policy is effective as of July 2026. We reserve the right to update this policy.
            Significant changes will be communicated via email or in-app notification.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
