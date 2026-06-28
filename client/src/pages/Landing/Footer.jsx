const quickLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const productLinks = [
  { label: 'Task Management', href: '#' },
  { label: 'AI Planning', href: '#' },
  { label: 'Focus Mode', href: '#' },
  { label: 'Analytics', href: '#' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-emerald-600">FlowSync AI</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              An AI-powered productivity platform that helps you plan smarter, focus better, and never miss a deadline.
            </p>
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
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
            <ul className="space-y-2">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">&copy; {year} FlowSync AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
