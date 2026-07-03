import CurrentTask from './CurrentTask'
import SessionStats from './SessionStats'
import Timer from './Timer'
import { getTasks } from '../../services/taskService'
import { getFocusSuggestion } from '../../services/aiService'
import { motion } from 'framer-motion'
import { Brain, ListTodo, Loader2, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

// Focus mode page with Pomodoro timer, task selection, and AI suggestions
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

function FocusMode() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestionKey, setSuggestionKey] = useState(0)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(Array.isArray(data) ? data : [])
      } catch {
        toast.error('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
    const interval = setInterval(fetchTasks, 30000)
    return () => clearInterval(interval)
  }, [])
  const [selectedTask, setSelectedTask] = useState(null)
  const [mode, setMode] = useState('focus')
  const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem('flowsync_focus_sessions') || '0'))
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => parseInt(localStorage.getItem('flowsync_focus_minutes') || '0'))
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    if (!selectedTask) { setAiSuggestion(null); return }
    setAiLoading(true)
    Promise.resolve().then(async () => {
      try {
        const data = await getFocusSuggestion(selectedTask._id)
        setAiSuggestion(data)
      } catch {
        setAiSuggestion({
          title: selectedTask.priority === 'high' ? 'High Priority Focus' : 'Steady Focus',
          desc: `Focus on "${selectedTask.title}".`,
          breakSuggestion: 'Standard 5-min breaks recommended',
          focusTime: 25,
        })
      } finally {
        setAiLoading(false)
      }
    })
  }, [selectedTask, suggestionKey])

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

  const overdueCount = activeTasks.filter(t => t.deadline && new Date(t.deadline) < new Date()).length

  return (
    <motion.div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Focus Mode - FlowSync AI</title>
        <meta name="description" content="Deep work with AI-adjusted Pomodoro sessions" />
      </Helmet>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Focus Mode</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep work with AI-adjusted Pomodoro sessions</p>
        </div>
        <div className="flex items-center gap-3" />
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
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={18} className="animate-spin text-slate-400" />
                </div>
              ) : activeTasks.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No active tasks</p>
              ) : (
                activeTasks.map(t => (
                  <motion.button key={t._id} variants={itemVariants} onClick={() => setSelectedTask(t)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${selectedTask?._id === t._id ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-900/50' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    {t.title}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SessionStats sessions={sessions} totalMinutes={totalFocusMinutes} mode={mode} />
          {aiLoading && selectedTask && (
            <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Suggestion</h3>
              </div>
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="animate-spin text-indigo-500" />
              </div>
            </motion.div>
          )}
          {selectedTask && aiSuggestion && !aiLoading && (
            <>
              <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Suggestion</h3>
                  <button onClick={() => setSuggestionKey(k => k + 1)} className="ml-auto text-[10px] text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">Refresh</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">Recommendation</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{aiSuggestion.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium uppercase tracking-wide">Focus Time</p>
                      <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{aiSuggestion.focusTime || 25} min</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                      <p className="text-[10px] text-amber-500 dark:text-amber-400 font-medium uppercase tracking-wide">Energy Needed</p>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 capitalize">{aiSuggestion.energyRequired || 'medium'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                    <Brain size={14} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-300">{aiSuggestion.breakSuggestion}</p>
                  </div>
                  {aiSuggestion.reason && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{aiSuggestion.reason}</p>
                  )}
                </div>
              </motion.div>
              {overdueCount > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-4">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">{overdueCount} overdue task{overdueCount > 1 ? 's' : ''}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Consider focusing on overdue items first for maximum impact.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FocusMode
