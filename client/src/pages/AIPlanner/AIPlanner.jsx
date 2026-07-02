import { useState, useRef, useEffect, useCallback } from 'react'
import { Brain, Send, Loader2, Plus, Check, Bot, User, Sparkles, Trash2, X, MessageSquare, Mic, MicOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { chatAI } from '../../services/aiService'
import { createTask } from '../../services/taskService'
import { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory } from '../../services/chatService'
import toast from 'react-hot-toast'
import { openBrowserSettings } from '../../utils/permissions'
// AI Planner with chat, voice input, task creation, and session management
const defaultMessage = { role: 'ai', text: "Hi! I'm your AI assistant. Tell me what you're working on, or ask me to create tasks for you." }

const suggestions = [
  'Create a task to finish my project report',
  'I have a math exam next week, help me plan',
  'Add a high priority task for team meeting tomorrow',
  'What tasks are overdue?',
]

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }

function formatDate(d) {
  const date = new Date(d)
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }

function AIPlanner() {
  const [sessionId, setSessionId] = useState(genId)
  const [sessions, setSessions] = useState([])
  const [messages, setMessages] = useState([defaultMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showSessions, setShowSessions] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)
  const listeningRef = useRef(listening)

  useEffect(() => { listeningRef.current = listening }, [listening])

  const checkMicPermission = useCallback(async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' })
        return result.state
      }
      return 'prompt'
    } catch {
      return 'prompt'
    }
  }, [])

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const toggleVoice = useCallback(async () => {
    if (listening) {
      stopVoice()
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice input not supported in this browser. Try Chrome or Edge.')
      return
    }
    const perm = await checkMicPermission()
    if (perm === 'denied') {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm">Microphone is blocked. Allow it in browser settings.</span>
          <div className="flex gap-2">
            <button onClick={() => { openBrowserSettings(); toast.dismiss(t.id) }} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
              Open Settings
            </button>
            <button onClick={() => toast.dismiss(t.id)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-zinc-600">
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 8000 })
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }
    recognition.onerror = (event) => {
      stopVoice()
      switch (event.error) {
        case 'not-allowed':
          toast.error('Microphone permission was denied. Allow access in your browser settings, then reload the page.')
          break
        case 'no-speech':
          toast.error('No speech detected. Try speaking closer to the microphone.')
          break
        case 'audio-capture':
          toast.error('No microphone found. Check your microphone connection.')
          break
        case 'network':
          toast.error('Network error. Check your internet connection.')
          break
        case 'aborted':
          break
        case 'service-not-allowed':
          toast.error('Speech recognition is not allowed on this page. Try using HTTPS.')
          break
        default:
          toast.error('Microphone error. Check permissions.')
      }
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening, checkMicPermission, stopVoice])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && listeningRef.current) {
        stopVoice()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      stopVoice()
    }
  }, [])

  const loadSession = useCallback(async (sid) => {
    if (listeningRef.current) stopVoice()
    setInitialLoading(true)
    setShowSessions(false)
    try {
      const msgs = await getChatHistory(sid)
      setMessages(msgs.length > 0 ? msgs : [defaultMessage])
      setSessionId(sid)
    } catch {
      setMessages([defaultMessage])
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    getChatSessions()
      .then(s => {
        setSessions(s)
        if (s.length > 0) {
          loadSession(s[0]._id)
        } else {
          setInitialLoading(false)
        }
      })
      .catch(() => setInitialLoading(false))
  }, [loadSession])

  const newChat = useCallback(async () => {
    if (listeningRef.current) stopVoice()
    const sid = genId()
    setSessionId(sid)
    setMessages([defaultMessage])
    setShowSessions(false)
  }, [])

  useEffect(() => {
    if (!initialLoading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, initialLoading])

  const handleSend = async (text) => {
    const msgText = text || input
    if (!msgText.trim() || loading) return
    setInput('')
    setLoading(true)

    const userMsg = { sessionId, role: 'user', text: msgText }
    try {
      const savedUser = await saveChatMessage(userMsg)
      setMessages(prev => [...prev, savedUser])

      const res = await chatAI(msgText)
      const aiPayload = {
        sessionId,
        role: 'ai',
        text: res.reply,
        tasks: res.tasks || [],
        createdTasks: res.createdTasks || [],
      }
      const savedAI = await saveChatMessage(aiPayload)
      setMessages(prev => [...prev, savedAI])

      getChatSessions().then(s => setSessions(s)).catch(() => {})
    } catch (err) {
      const errMsg = err?.response?.status === 503 ? "AI service quota exceeded. Please try again later." : 'Sorry, something went wrong. Try again.'
      const savedErr = await saveChatMessage({ sessionId, role: 'ai', text: errMsg }).catch(() => null)
      setMessages(prev => [...prev, savedErr || { role: 'ai', text: errMsg }])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    try {
      await deleteChatMessage(id)
      setMessages(prev => prev.filter(m => m._id !== id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    }
  }

  const handleDeleteSession = async (sid) => {
    try {
      await clearChatHistory(sid)
      setSessions(prev => prev.filter(s => s._id !== sid))
      if (sessionId === sid) newChat()
      toast.success('Session deleted')
    } catch {
      toast.error('Failed to delete session')
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
    <motion.div className="flex h-[calc(100vh-8rem)] sm:h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>AI Chat - FlowSync AI</title>
        <meta name="description" content="Chat with AI to plan tasks" />
      </Helmet>
      <div className={`${showSessions ? 'flex' : 'hidden'} md:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800`}>
        <div className="flex items-center justify-between px-4 h-12 border-b border-slate-200 dark:border-zinc-800">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chat History</span>
          <button onClick={newChat} className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors" title="New Chat">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {sessions.map(s => (
            <div key={s._id} className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              sessionId === s._id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`} onClick={() => loadSession(s._id)}>
              <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${sessionId === s._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{s.preview?.length > 45 ? s.preview.slice(0, 45) + '...' : s.preview}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{s.messageCount} msg</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">·</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(s.createdAt)}</span>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDeleteSession(s._id) }} className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all" title="Delete session">
                <X size={12} />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <MessageSquare size={24} className="text-slate-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs text-slate-400 dark:text-zinc-600">No previous chats</p>
              <p className="text-[10px] text-slate-300 dark:text-zinc-700 mt-1">Start a conversation to see it here</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => setShowSessions(!showSessions)}>
              {showSessions ? <X size={18} /> : <MessageSquare size={18} />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Brain size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Chat</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ask me to plan, create tasks, or help organize</p>
            </div>
          </div>
          {messages.length > 1 && (
            <button onClick={newChat} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
              <Trash2 size={15} /> New Chat
            </button>
          )}
        </div>

        {initialLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={msg._id || i} className="group relative flex gap-3 flex-col">
                  <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
                      <div className="flex items-start gap-2">
                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-md'
                            : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-tl-md'
                        }`}>
                          {msg.text}
                        </div>
                        {msg._id && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete message"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {msg.role === 'ai' && msg.tasks && msg.tasks.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.tasks.map((task, j) => {
                            const alreadyCreated = (msg.createdTasks || []).some(ct => ct.title === task.title)
                            return (
                              <div key={j} className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between gap-3">
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-medium transition-colors disabled:opacity-50 flex-shrink-0"
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
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={15} className="text-white" />
                  </div>
                  <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl rounded-tl-md px-4 py-3">
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
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles size={10} /> {s}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex-shrink-0">
              {listening && (
                <div className="flex items-center gap-2 mb-2 text-xs text-red-500 font-medium animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Listening... Speak now
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={listening ? 'Speak now...' : 'Ask me anything...'}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <div className="relative flex items-center">
                  {listening && (
                    <div className="absolute -left-1 -top-1 -bottom-1 flex items-center gap-[2px] px-2 bg-red-500/10 rounded-xl">
                      <span className="w-[3px] bg-red-500 rounded-full animate-pulse" style={{height:'12px',animationDelay:'0s'}} />
                      <span className="w-[3px] bg-red-500 rounded-full animate-pulse" style={{height:'18px',animationDelay:'0.2s'}} />
                      <span className="w-[3px] bg-red-500 rounded-full animate-pulse" style={{height:'8px',animationDelay:'0.4s'}} />
                      <span className="w-[3px] bg-red-500 rounded-full animate-pulse" style={{height:'16px',animationDelay:'0.1s'}} />
                      <span className="w-[3px] bg-red-500 rounded-full animate-pulse" style={{height:'10px',animationDelay:'0.3s'}} />
                    </div>
                  )}
                  <button
                    onClick={toggleVoice}
                    disabled={loading}
                    className={`relative px-3 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${listening ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30 scale-105' : 'border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                    title={listening ? 'Tap to stop recording' : 'Voice input'}
                  >
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                    {listening && <span className="text-xs font-medium hidden sm:inline">Stop</span>}
                  </button>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default AIPlanner
