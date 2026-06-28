import { Trophy, Flame, Target, CheckCircle, Zap, Star } from 'lucide-react'

const milestones = [
  { icon: CheckCircle, label: '10 Tasks', check: (t) => t.length >= 10, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: CheckCircle, label: '50 Tasks', check: (t) => t.length >= 50, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { icon: CheckCircle, label: '100 Tasks', check: (t) => t.length >= 100, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Flame, label: '7 Day Focus Streak', check: (h) => h >= 0, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { icon: Target, label: '5 Goals Set', check: (g) => g.length >= 5, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Zap, label: 'All Tasks Done', check: (t) => t.length > 0 && t.every(tt => tt.completed), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
]

function Achievements({ tasks, goals, habits }) {
  const achieved = milestones.filter(m => m.check(tasks) || m.check(goals) || m.check(habits))
  const progress = Math.round((achieved.length / milestones.length) * 100)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Trophy size={15} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Achievements</h2>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{achieved.length}/{milestones.length}</span>
      </div>

      <div className="space-y-2">
        {milestones.map(({ icon: Icon, label, check, color, bg }) => {
          const unlocked = check(tasks) || check(goals) || check(habits)
          return (
            <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-300 ${unlocked ? 'bg-slate-50 dark:bg-zinc-800' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-lg ${unlocked ? bg : 'bg-slate-100 dark:bg-zinc-800'} flex items-center justify-center`}>
                <Icon size={16} className={unlocked ? color : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>{label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{unlocked ? 'Unlocked' : 'Locked'}</p>
              </div>
              {unlocked && <Star size={14} className="text-amber-500 flex-shrink-0" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Achievements
