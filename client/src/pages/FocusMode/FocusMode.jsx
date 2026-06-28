import { useState, useEffect } from 'react'
import { Brain, ListTodo } from 'lucide-react'
import Timer from './Timer'
import CurrentTask from './CurrentTask'
import SessionStats from './SessionStats'
import FocusMusic from './FocusMusic'
import toast from 'react-hot-toast'
import { getTasks } from '../../services/taskService'

function FocusMode() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(Array.isArray(data) ? data : [])
      } catch { /* ignore */ }
    }
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000)
    return () => clearInterval(interval)
  }, [])
  const [selectedTask, setSelectedTask] = useState(null)
  const [mode, setMode] = useState('focus')
  const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem('flowsync_focus_sessions') || '0'))
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => parseInt(localStorage.getItem('flowsync_focus_minutes') || '0'))
  const [showMusic, setShowMusic] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const handleSessionComplete = () => {
    const newSessions = sessions + 1
    const newMinutes = totalFocusMinutes + (mode === 'focus' ? 25 : 5)
    setSessions(newSessions)
    setTotalFocusMinutes(newMinutes)
    localStorage.setItem('flowsync_focus_sessions', newSessions.toString())
    localStorage.setItem('flowsync_focus_minutes', newMinutes.toString())
    setSessionComplete(true)
    setTimeout(() => setSessionComplete(false), 3000)

    if (mode === 'focus') {
      toast.success('Focus session complete! Take a break.')
      setMode('break')
    } else {
      toast.success('Break over! Ready to focus?')
      setMode('focus')
    }
  }

  const activeTasks = tasks.filter(t => t.status !== 'done')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Focus Mode</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep work with AI-adjusted Pomodoro sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMusic(!showMusic)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-300 ${showMusic ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600' : 'border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}>
            {showMusic ? 'Hide Music' : 'Ambient Sounds'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center">
          <CurrentTask task={selectedTask} />
          <Timer mode={mode} onComplete={handleSessionComplete} sessionComplete={sessionComplete} />
          <div className="w-full max-w-md mt-6">
            <div className="flex items-center gap-2 mb-3">
              <ListTodo size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Focus on a task</span>
            </div>
            <div className="space-y-1">
              {activeTasks.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No active tasks</p>
              ) : (
                activeTasks.map(t => (
                  <button key={t._id} onClick={() => setSelectedTask(t)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 ${selectedTask?._id === t._id ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-900/50' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    {t.title}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SessionStats sessions={sessions} totalMinutes={totalFocusMinutes} mode={mode} />
          {showMusic && <FocusMusic />}
          {selectedTask && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Suggestion</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Focus on <strong className="text-indigo-600 dark:text-indigo-400">{selectedTask.title}</strong> first due to its {selectedTask.priority === 'high' ? 'high priority and risk level' : selectedTask.priority === 'medium' ? 'medium priority' : 'low priority — good for momentum building'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FocusMode
