import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, UserCheck, Shield, Scale, Brain, Cpu, AlertTriangle, Gavel, Mail, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

// Terms & Conditions page with full legal text (card layout matching Privacy)
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

const sections = [
  {
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: [
      'By creating an account, accessing, or using FlowSync AI (the "Service"), you agree to be bound by these Terms & Conditions and our Privacy Policy.',
      'If you do not agree with any part of these terms, you must not use the Service.',
      'We may update these terms from time to time; continued use after changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    icon: UserCheck,
    title: '2. Eligibility & Accounts',
    content: [
      'You must be at least 13 years old to use the Service.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
      'You must provide accurate and complete information when creating an account.',
      'One account per person is permitted unless otherwise agreed.',
    ],
  },
  {
    icon: Shield,
    title: '3. Acceptable Use',
    content: [
      'Use the Service lawfully and only for its intended productivity purposes.',
      'Do not attempt to disrupt, overload, or gain unauthorized access to the Service or its infrastructure.',
      'Do not upload malicious content, viruses, or unlawful material.',
      'Do not use automated scripts, scraping, or bots to abuse the Service or its rate limits.',
      'You are responsible for all content you create, including tasks, goals, and AI chat messages.',
    ],
  },
  {
    icon: Brain,
    title: '4. AI Services & Disclaimer',
    content: [
      'The Service uses third-party AI providers (Groq, Google Gemini, Cerebras, Mistral, OpenRouter) to generate plans, prioritizations, and suggestions.',
      'AI output is generated automatically and may occasionally be inaccurate, incomplete, or unsuitable — always review AI suggestions before relying on them.',
      'No personal identifiers (name or email) are sent to AI providers.',
      'We are not responsible for decisions you make based on AI-generated suggestions.',
    ],
  },
  {
    icon: Cpu,
    title: '5. Intellectual Property',
    content: [
      'The Service, including its software, design, logo, and branding, is proprietary to FlowSync AI.',
      'You retain ownership of the data and content you create using the Service.',
      'You grant us a limited license to store and process your data solely to operate and improve the Service.',
      'You may not copy, modify, resell, or reverse-engineer the Service.',
    ],
  },
  {
    icon: Scale,
    title: '6. Third-Party Services',
    content: [
      'The Service relies on third-party providers: Vercel (hosting), MongoDB Atlas (database), and AI/email/push providers.',
      'We are not liable for the availability, performance, or security of third-party services beyond our control.',
      'Those providers have their own terms and privacy policies which govern their processing.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '7. Disclaimers of Warranty',
    content: [
      'The Service is provided "as is" and "as available" without warranties of any kind, express or implied.',
      'We do not warrant that the Service will be uninterrupted, error-free, or secure at all times.',
      'While we take reasonable measures (encryption, rate limiting, backups), no method of transmission or storage is 100% secure.',
    ],
  },
  {
    icon: Gavel,
    title: '8. Limitation of Liability',
    content: [
      'To the maximum extent permitted by law, FlowSync AI and its developer shall not be liable for any indirect, incidental, special, or consequential damages.',
      'Our total aggregate liability arising from your use of the Service shall not exceed the amount you paid us (if any) in the 12 months preceding the claim.',
      'We are not liable for lost productivity, missed deadlines, or decisions made using the Service.',
    ],
  },
  {
    icon: RefreshCcw,
    title: '9. Termination',
    content: [
      'You may delete your account at any time via Settings — your data is permanently removed within 24 hours.',
      'We may suspend or terminate accounts that violate these terms, abuse the Service, or pose a security risk.',
      'Upon termination, your right to use the Service ends immediately.',
    ],
  },
  {
    icon: Mail,
    title: '10. Changes, Governing Law & Contact',
    content: [
      'We may modify the Service or these terms at any time; significant changes will be communicated via email or in-app notification.',
      'These terms are governed by the laws applicable in the developer\u2019s jurisdiction, without regard to conflict-of-law principles.',
      'For questions or concerns, contact: shubhamkumar997800@gmail.com — response within 48 hours.',
    ],
  },
]

function Terms() {
  return (
    <motion.div className="min-h-screen bg-slate-50 dark:bg-zinc-950" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Terms & Conditions - FlowSync AI</title>
        <meta name="description" content="Terms and conditions for using FlowSync AI" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Terms &amp; Conditions</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: June 2030</p>

        <div className="space-y-6">
          {sections.map(({ icon: Icon, title, content }) => (
            <motion.div key={title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6" variants={itemVariants}>
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
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            These terms are effective as of August 28, 2026. We reserve the right to update them; changes will be communicated
            via email or in-app notification.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Terms
