function Badge({ children, color = 'text-indigo-600 dark:text-indigo-400', bg = 'bg-indigo-100 dark:bg-indigo-900/30', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${bg} ${color} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
