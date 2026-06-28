import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI Planner', href: '#ai-planner' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#2563EB] tracking-tight">
            FlowSync AI
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827] px-4 py-2 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1d4ed8] px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[#6B7280]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E5E7EB] bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-[#6B7280] hover:text-[#111827] py-2"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-[#E5E7EB]" />
              <button
                onClick={() => { setMobileOpen(false); navigate('/login') }}
                className="block w-full text-sm font-medium text-center text-[#6B7280] py-2"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/register') }}
                className="block w-full text-sm font-medium text-center text-white bg-[#2563EB] hover:bg-[#1d4ed8] px-5 py-2 rounded-lg"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
