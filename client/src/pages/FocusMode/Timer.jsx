import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import ProgressCircle from './ProgressCircle'

function Timer({ mode: externalMode, onComplete, sessionComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState(externalMode || 'focus')
  const intervalRef = useRef(null)

  const FOCUS_TIME = 25 * 60
  const BREAK_TIME = 5 * 60
  const LONG_BREAK = 15 * 60

  useEffect(() => {
    setMode(externalMode)
  }, [externalMode])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            onComplete()
            return mode === 'focus' ? BREAK_TIME : FOCUS_TIME
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  useEffect(() => {
    if (sessionComplete) {
      setIsRunning(false)
    }
  }, [sessionComplete])

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
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : newMode === 'break' ? BREAK_TIME : LONG_BREAK)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalTime = mode === 'focus' ? FOCUS_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-8 w-full max-w-md">
      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => switchMode('focus')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${mode === 'focus' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
          <Brain size={16} /> Focus
        </button>
        <button onClick={() => switchMode('break')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${mode === 'break' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
          <Coffee size={16} /> Break
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <ProgressCircle progress={progress} />
      </div>

      <div className="text-center mb-8">
        <p className="text-6xl font-bold text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 capitalize">{mode === 'focus' ? 'Focus Session' : mode === 'break' ? 'Break Time' : 'Long Break'}</p>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={toggleTimer} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-colors duration-300 shadow-sm ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'}`}>
          {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
        </button>
        <button onClick={resetTimer} className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <RotateCcw size={18} /> Reset
        </button>
      </div>
    </div>
  )
}

export default Timer
