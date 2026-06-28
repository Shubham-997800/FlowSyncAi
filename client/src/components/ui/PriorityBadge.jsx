const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium' },
  low: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: 'Low' },
}

function PriorityBadge({ priority = 'medium' }) {
  const cfg = priorityConfig[priority] || priorityConfig.medium
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { priorityConfig }
export default PriorityBadge
