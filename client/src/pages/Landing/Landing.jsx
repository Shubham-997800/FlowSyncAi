import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Moon, Sun, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTheme } from '../../context/ThemeContext'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorks from './HowItWorks'
import CTASection from './CTASection'
import Footer from './Footer'

function Landing() {
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setShowTop(y > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
  ]

  return (
    <>
      <Helmet>
        <title>FlowSync AI — AI-Powered Productivity OS | Never Miss a Deadline</title>
        <meta name="description" content="FlowSync AI is an intelligent productivity companion that analyzes your tasks, predicts deadline risks, and creates personalized schedules with AI." />
        <meta name="keywords" content="AI productivity, task management, deadline prediction, smart scheduling, focus timer, AI planner" />
        <meta property="og:title" content="FlowSync AI — AI-Powered Productivity OS" />
        <meta property="og:description" content="Plan Smarter. Focus Better. Finish Faster. AI-powered task prioritization and smart scheduling." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FlowSync AI — AI-Powered Productivity OS" />
        <meta name="twitter:description" content="Plan Smarter. Focus Better. Finish Faster." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100">
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-zinc-900/80' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">FlowSync AI</Link>

              <div className="hidden md:flex items-center gap-6">
                {links.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors duration-300">{l.label}</a>
                ))}
                <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link to="/login" className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors duration-300">Login</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]">Get Started</Link>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button aria-label="Toggle menu" className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="md:hidden bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 overflow-hidden"
              >
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">{l.label}</a>
                  ))}
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors duration-300">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-center transition-colors duration-300">Get Started</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
        <Footer />
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors active:scale-90"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default Landing
