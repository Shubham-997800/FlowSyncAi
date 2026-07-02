import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
// 401 page shown when user lacks permission to access a route
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function Unauthorized() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>401 — Access Denied | FlowSync AI</title>
        <meta name="description" content="You don't have permission to access this page." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-md">
          <motion.div variants={item}>
            <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={40} className="text-red-600 dark:text-red-400" />
            </div>
          </motion.div>
          <motion.h1 variants={item} className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</motion.h1>
          <motion.p variants={item} className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">You don't have permission to access this page. Contact your administrator if you believe this is a mistake.</motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
              <Home size={16} /> Go to Dashboard
            </button>
            <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
              <ArrowLeft size={16} /> Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default Unauthorized
