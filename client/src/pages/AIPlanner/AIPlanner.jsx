import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Loader2, Plus, Check, Bot, User, Sparkles } from 'lucide-react'
import { chatAI } from '../../services/aiService'
import { createTask } from '../../services/taskService'
import toast from 'react-hot-toast'

const suggestions = [
  'Create a task to finish my project report',
  'I have a math exam next week, help me plan',
  'Add a high priority task for team meeting tomorrow',
  'What tasks are overdue?',
]

function AIPlanner() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI assistant. Tell me what you're working on, or ask me to create tasks for you." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await chatAI(msg)
      setMessages(prev => [...prev, { role: 'ai', text: res.reply, tasks: res.tasks || [], createdTasks: res.createdTasks || [] }])
    } catch (err) {
      const msg = err?.response?.status === 503 ? "AI service quota exceeded. Please try again later." : 'Sorry, something went wrong. Try again.'
      setMessages(prev => [...prev, { role: 'ai', text: msg }])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (task, msgIndex) => {
    setCreating(msgIndex)
    try {
      const created = await createTask({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        deadline: task.deadline || null,
      })
      setMessages(prev => prev.map((m, i) =>
        i === msgIndex ? { ...m, createdTasks: [...(m.createdTasks || []), created] } : m
      ))
      toast.success(`Task created: ${task.title}`)
    } catch {
      toast.error('Failed to create task')
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <Brain size={22} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Chat</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ask me to plan, create tasks, or help organize</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-indigo-100 dark:bg-indigo-900/40'
                : 'bg-indigo-600 dark:bg-indigo-500'
            }`}>
              {msg.role === 'user'
                ? <User size={15} className="text-indigo-600 dark:text-indigo-400" />
                : <Bot size={15} className="text-white" />
              }
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-md'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-tl-md'
              }`}>
                {msg.text}
              </div>

              {msg.role === 'ai' && msg.tasks && msg.tasks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.tasks.map((task, j) => {
                    const alreadyCreated = (msg.createdTasks || []).some(ct => ct.title === task.title)
                    return (
                      <div key={j} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                              'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            }`}>{task.priority || 'medium'}</span>
                            {task.deadline && <span className="text-xs text-slate-400 dark:text-slate-500">{task.deadline}</span>}
                          </div>
                        </div>
                        {alreadyCreated ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0">
                            <Check size={14} /> Created
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCreateTask(task, i)}
                            disabled={creating === i}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-medium transition-colors duration-300 disabled:opacity-50 flex-shrink-0"
                          >
                            {creating === i ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                            Create
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl rounded-tl-md px-4 py-3">
              <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mt-4 flex-shrink-0">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors duration-300 disabled:opacity-50 flex items-center gap-1"
            >
              <Sparkles size={10} /> {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIPlanner
