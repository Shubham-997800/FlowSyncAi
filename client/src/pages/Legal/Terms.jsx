import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

function Terms() {
  return (
    <motion.div className="min-h-screen bg-slate-50 dark:bg-zinc-950" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Terms & Conditions - FlowSync AI</title>
        <meta name="description" content="Terms and conditions for using FlowSync AI" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Terms &amp; Conditions</h1>
        <motion.div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-4 text-sm leading-relaxed" variants={itemVariants}>
          <p>Welcome to FlowSync AI. By using our platform, you agree to these terms.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Acceptance</h2>
          <p>By creating an account or using FlowSync AI, you accept these Terms and our Privacy Policy.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">2. Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. Use</h2>
          <p>FlowSync AI is a productivity tool. You agree not to misuse the platform for any unlawful purpose.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4. Data</h2>
          <p>We store your task, goal, and habit data to provide our services. See our Privacy Policy for details.</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">5. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          <p className="text-xs text-slate-400 pt-4">Last updated: June 2026</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Terms
