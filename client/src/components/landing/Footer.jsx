import { GitBranch, Globe, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

const socialLinks = [
  { icon: GitBranch, href: 'https://github.com/Shubham-997800/FlowSync-Ai', label: 'GitHub' },
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@flowsync.ai', label: 'Email' },
]

function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <Link to="/" className="text-xl font-bold text-[#2563EB]">
            FlowSync AI
          </Link>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-[#111827] transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>

        <hr className="border-[#E5E7EB] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <p>&copy; {new Date().getFullYear()} FlowSync AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
