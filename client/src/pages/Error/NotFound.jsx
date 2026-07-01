import { Search, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | FlowSync AI</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-md">
          <motion.div variants={item} className="relative mb-8 inline-block">
            <div className="w-24 h-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto">
              <Search size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 200 }} className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">?</span>
            </motion.div>
          </motion.div>
          <motion.h1 variants={item} className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">404</motion.h1>
          <motion.p variants={item} className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Page not found. The page you're looking for doesn't exist or has been moved.</motion.p>
          <motion.div variants={item}>
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300">
              <Home size={16} /> Go to Dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default NotFound
