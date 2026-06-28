function ProgressCircle({ progress, size = 180, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-slate-200 dark:stroke-zinc-700" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          className="stroke-indigo-500 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{Math.round(progress)}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">completed</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressCircle
