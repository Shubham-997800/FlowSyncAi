export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900/40 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
    </div>
  )
}
