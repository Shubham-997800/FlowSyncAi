export default function LoadingSpinner({ page }) {
  if (page) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 animate-pulse">
        <div className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-10 h-10 border-[3px] border-indigo-200 dark:border-indigo-900/40 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-[3px] border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
      </div>
    </div>
  )
}
