import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, ListTodo } from 'lucide-react'
import toast from 'react-hot-toast'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function FocusMode() {
  const [mode, setMode] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const [tasks, setTasks] = useState(loadTasks)
  const [showTasks, setShowTasks] = useState(false)
  const intervalRef = useRef(null)

  const FOCUS_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            if (mode === 'focus') {
              const newSessions = sessions + 1
              setSessions(newSessions)
              const stored = localStorage.getItem('flowsync_focus_sessions')
              const total = (stored ? parseInt(stored) : 0) + 1
              localStorage.setItem('flowsync_focus_sessions', total.toString())
              toast.success('Focus session complete! Take a break.')
              setMode('break')
              setTimeLeft(BREAK_TIME)
            } else {
              toast.success('Break over! Ready to focus?')
              setMode('focus')
              setTimeLeft(FOCUS_TIME)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME)
  }

  const switchMode = (newMode) => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const activeTasks = tasks.filter(t => !t.completed)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Focus Mode</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep work with AI-adjusted Pomodoro sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Today:</span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{sessions} sessions</span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm text-center">
          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => switchMode('focus')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'focus' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
              <Brain size={16} /> Focus
            </button>
            <button onClick={() => switchMode('break')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'break' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
              <Coffee size={16} /> Break
            </button>
          </div>

          <div className="relative mb-8">
            <svg className="w-48 h-48 mx-auto -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" className="dark:stroke-zinc-700" />
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`} strokeLinecap="round" className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">{mode} {mode === 'focus' ? 'session' : 'time'}</p>
              </div>
            </div>
          </div>

          {selectedTask && (
            <div className="mb-4 px-3 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 justify-center">
              <ListTodo size={14} className="text-indigo-500" />
              {selectedTask.title}
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button onClick={toggleTimer} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition shadow-sm ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'}`}>
              {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
            </button>
            <button onClick={resetTimer} className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={() => setShowTasks(!showTasks)} className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <ListTodo size={16} /> {showTasks ? 'Hide' : 'Show'} tasks
          </button>
          {showTasks && (
            <div className="mt-3 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-3 space-y-1">
              {activeTasks.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No active tasks</p>
              ) : activeTasks.map(t => (
                <button key={t._id} onClick={() => setSelectedTask(t)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${selectedTask?._id === t._id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                  {t.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FocusMode
