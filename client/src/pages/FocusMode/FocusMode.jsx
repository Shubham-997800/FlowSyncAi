import CurrentTask from './CurrentTask'
import SessionStats from './SessionStats'
import Timer from './Timer'
import { getTasks } from '../../services/taskService'
import { motion } from 'framer-motion'
import { Brain, ListTodo, Lightbulb, Clock, Zap, Loader2 } from 'lucide-react'
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
  const highPriorityCount = activeTasks.filter(t => t.priority === 'high').length

  const getAiSuggestion = () => {
    if (!selectedTask) return null
    const taskPriority = selectedTask.priority || 'medium'
    const isOverdue = selectedTask.deadline && new Date(selectedTask.deadline) < new Date()

    if (isOverdue) {
      return {
        icon: Zap,
        title: 'Urgent: Overdue Task',
        desc: `"${selectedTask.title}" is overdue. Set shorter focus blocks (15 min) to power through it.`,
        breakSuggestion: 'Take shorter 3-min breaks to maintain momentum',
      }
    }
    if (taskPriority === 'high') {
      return {
        icon: Clock,
        title: 'High Priority Focus',
        desc: `"${selectedTask.title}" is high priority. Use 25 min focus blocks to make significant progress.`,
        breakSuggestion: 'Take 7-min breaks to recharge after intense focus',
      }
    }
    if (taskPriority === 'low') {
      return {
        icon: Lightbulb,
        title: 'Low Momentum Task',
        desc: `"${selectedTask.title}" is low priority. Use 20 min blocks to build momentum without burnout.`,
        breakSuggestion: 'Extend breaks to 10 min for relaxed pacing',
      }
    }
    return {
      icon: Brain,
      title: 'Steady Focus',
      desc: `Focus on "${selectedTask.title}" with standard 25 min blocks.`,
      breakSuggestion: 'Standard 5-min breaks recommended',
    }
  }

  const aiSuggestion = getAiSuggestion()

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
                  <motion.button key={t._id} variants={itemVariants} onClick={() => setSelectedTask(t)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 ${selectedTask?._id === t._id ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-900/50' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    {t.title}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SessionStats sessions={sessions} totalMinutes={totalFocusMinutes} mode={mode} />
          {selectedTask && aiSuggestion && (
            <>
              <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Suggestion</h3>
                </div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${selectedTask.priority === 'high' || (selectedTask.deadline && new Date(selectedTask.deadline) < new Date()) ? 'bg-red-100 dark:bg-red-900/30' : selectedTask.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                  <aiSuggestion.icon size={15} className={
                    selectedTask.priority === 'high' || (selectedTask.deadline && new Date(selectedTask.deadline) < new Date()) ? 'text-red-600 dark:text-red-400' : selectedTask.priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
                  } />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{aiSuggestion.desc}</p>
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                  <Clock size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">{aiSuggestion.breakSuggestion}</p>
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
