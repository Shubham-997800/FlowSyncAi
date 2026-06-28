function Card({ children, className = '', hover = true, padding = 'p-5' }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm ${padding} ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default Card
