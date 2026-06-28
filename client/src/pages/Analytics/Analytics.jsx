import { useState, useEffect } from 'react'
import { TrendingUp, Clock, Brain, Flame } from 'lucide-react'
import ProductivityChart from './ProductivityChart'
import WeeklyChart from './WeeklyChart'
import MonthlyChart from './MonthlyChart'
import FocusChart from './FocusChart'
import AIReport from './AIReport'
import Achievements from './Achievements'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function loadGoalData() {
  try { const d = localStorage.getItem('flowsync_goals'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function loadHabitData() {
  try { const d = localStorage.getItem('flowsync_habits'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function Analytics() {
  const [tasks, setTasks] = useState(loadTasks)
  const [goals] = useState(loadGoalData)
  const [habits] = useState(loadHabitData)
  const [period, setPeriod] = useState('weekly')

  useEffect(() => {
    const interval = setInterval(() => setTasks(loadTasks()), 2000)
    return () => clearInterval(interval)
  }, [])

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  const overdue = tasks.filter(t => t.dueDate && !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length
  const focusSessions = parseInt(localStorage.getItem('flowsync_focus_sessions') || '0')
  const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')
  const habitStreaks = habits.filter(h => (h.streak || 0) >= 3).length

  const topCards = [
    { icon: TrendingUp, label: 'Completion Rate', value: `${completionRate}%`, sub: `${completed}/${total} tasks`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: Clock, label: 'Focus Hours', value: `${Math.floor(parseInt(focusMinutes) / 60)}h`, sub: `${focusSessions} sessions`, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { icon: Brain, label: 'Productivity Score', value: completionRate >= 70 ? 'Great' : completionRate >= 40 ? 'Good' : 'Needs Work', sub: `${completionRate}% overall`, color: completionRate >= 70 ? 'text-emerald-600' : completionRate >= 40 ? 'text-amber-600' : 'text-red-600', bg: 'bg-slate-100 dark:bg-zinc-800' },
    { icon: Flame, label: 'Streak Days', value: habitStreaks.toString(), sub: 'habits with 3+ day streak', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Understand your productivity patterns</p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
          {['weekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 capitalize ${period === p ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {topCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}><Icon size={16} className={color} /></div>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ProductivityChart tasks={tasks} period={period} />
        <WeeklyChart tasks={tasks} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <MonthlyChart tasks={tasks} />
        <FocusChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AIReport tasks={tasks} completionRate={completionRate} overdue={overdue} focusSessions={focusSessions} habitStreaks={habitStreaks} />
        </div>
        <Achievements tasks={tasks} goals={goals} habits={habits} />
      </div>
    </div>
  )
}

export default Analytics
