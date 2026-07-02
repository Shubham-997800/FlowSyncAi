import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Check } from 'lucide-react'
import ProgressCircle from './ProgressCircle'

// Pomodoro timer with configurable focus/break intervals
const STORAGE_KEY = 'flowsync_timer_settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { focus: 25, break: 5 }
}

function saveSettings(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function Timer({ mode: externalMode, onComplete }) {
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [editFocus, setEditFocus] = useState(settings.focus)
  const [editBreak, setEditBreak] = useState(settings.break)

  const FOCUS_TIME = settings.focus * 60
  const BREAK_TIME = settings.break * 60

  const [timeLeft, setTimeLeft] = useState(() => externalMode === 'focus' ? FOCUS_TIME : BREAK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState(externalMode || 'focus')
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    setMode(externalMode)
    setIsRunning(false)
    setTimeLeft(externalMode === 'focus' ? FOCUS_TIME : BREAK_TIME)
  }, [externalMode, settings])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setTimeout(() => {
            onCompleteRef.current()
            setIsRunning(false)
            setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME)
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode, settings])

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

  const saveCustomSettings = () => {
    const f = Math.max(1, Math.min(180, parseInt(editFocus) || 25))
    const b = Math.max(1, Math.min(60, parseInt(editBreak) || 5))
    const s = { focus: f, break: b }
    setSettings(s)
    saveSettings(s)
    setShowSettings(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-8 w-full max-w-md">
      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => switchMode('focus')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'focus' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
          <Brain size={16} /> Focus
        </button>
        <button onClick={() => switchMode('break')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'break' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
          <Coffee size={16} /> Break
        </button>
        <button onClick={() => { setEditFocus(settings.focus); setEditBreak(settings.break); setShowSettings(!showSettings) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showSettings ? 'bg-slate-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
          <Settings size={16} />
        </button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
          <div className="flex gap-4 mb-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Focus (min)</label>
              <input type="number" min={1} max={180} value={editFocus} onChange={e => setEditFocus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Break (min)</label>
              <input type="number" min={1} max={60} value={editBreak} onChange={e => setEditBreak(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
          <button onClick={saveCustomSettings} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium transition-colors">
            <Check size={16} /> Apply
          </button>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <ProgressCircle progress={progress} />
      </div>

      <div className="text-center mb-8">
        <p className="text-6xl font-bold text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 capitalize">{mode === 'focus' ? 'Focus Session' : 'Break Time'}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{mode === 'focus' ? `${settings.focus} min` : `${settings.break} min`}</p>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={toggleTimer} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'}`}>
          {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
        </button>
        <button onClick={resetTimer} className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <RotateCcw size={18} /> Reset
        </button>
      </div>
    </div>
  )
}

export default Timer
