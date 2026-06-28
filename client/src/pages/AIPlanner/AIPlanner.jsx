import { useState, useRef, useEffect } from 'react'
import { Send, Brain, Sparkles, ListTodo, Clock, AlertTriangle, BarChart3 } from 'lucide-react'

const suggestions = [
  'Help me plan my day',
  'Analyze my task priorities',
  'What should I work on first?',
  'Create a schedule for this week',
]

const mockResponses = {
  default: `I've analyzed your current tasks. Here's my recommendation:

**Top Priority:** Focus on high-urgency tasks first. I see several items that need attention today.

**Suggested Order:**
1. Complete high-priority tasks with approaching deadlines
2. Break down complex tasks into smaller steps
3. Schedule focused work blocks for deep work

**Tip:** Use Focus Mode for uninterrupted 25-minute sessions to make rapid progress.`,
}

function AIPlanner() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI productivity assistant. I can help you plan your day, prioritize tasks, or create a schedule. What would you like help with?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: mockResponses.default }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
          <Brain size={22} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Planner</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered scheduling and prioritization</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {[
          { icon: ListTodo, label: 'Task Analysis', value: 'Analyze & prioritize' },
          { icon: Clock, label: 'Schedule', value: 'Build daily plan' },
          { icon: AlertTriangle, label: 'Risk Check', value: 'Deadline alerts' },
          { icon: BarChart3, label: 'Insights', value: 'Productivity tips' },
        ].map(({ icon: Icon, label, value }) => (
          <button key={label} onClick={() => sendMessage(`Help me with ${label.toLowerCase()}. ${value}.`)} className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 border border-slate-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition text-left">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <Brain size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 dark:bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200'}`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-3 flex-shrink-0">
                <Brain size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-1">
                <Sparkles size={10} /> {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask AI to plan your day..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-4 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 text-sm flex items-center gap-2">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPlanner
