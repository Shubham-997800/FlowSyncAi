import { useState, useRef, useEffect, useCallback } from 'react'
import { Brain, Send, Loader2, Plus, Check, Bot, User, Sparkles, Trash2, X, MessageSquare, Mic, MicOff, History, Zap, Clock, Calendar, PartyPopper, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { chatAI, getAiUsage } from '../../services/aiService'
import { createTask } from '../../services/taskService'
import { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory } from '../../services/chatService'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { openBrowserSettings } from '../../utils/permissions'

const defaultMessage = { role: 'ai', text: "Hi! I'm your AI assistant. Tell me what you're working on, or ask me to create tasks for you." }

const suggestions = [
  { icon: Sparkles, text: 'Create a task to finish my project report', color: 'bg-violet-500/10' },
  { icon: Calendar, text: 'I have a math exam next week, help me plan', color: 'bg-blue-500/10' },
  { icon: Zap, text: 'Add a high priority task for team meeting tomorrow', color: 'bg-amber-500/10' },
  { icon: Clock, text: 'What tasks are overdue?', color: 'bg-rose-500/10' },
]

const funSuggestions = [
  { icon: PartyPopper, text: 'Tell me a joke', color: 'bg-fuchsia-500/10' },
  { icon: PartyPopper, text: 'Roast me', color: 'bg-purple-500/10' },
  { icon: PartyPopper, text: '20 questions game', color: 'bg-pink-500/10' },
  { icon: PartyPopper, text: 'Would you rather...', color: 'bg-orange-500/10' },
]

const gfSuggestions = [
  { icon: Heart, text: 'How was your day?', color: 'bg-rose-500/10' },
  { icon: Heart, text: 'I had a tough day', color: 'bg-pink-500/10' },
  { icon: Heart, text: 'Tell me something sweet', color: 'bg-fuchsia-500/10' },
  { icon: Heart, text: 'Chit chat with me', color: 'bg-red-500/10' },
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
  const [quality, setQuality] = useState('medium')
  const [mode, setMode] = useState('normal')
  const [aiUsage, setAiUsage] = useState(null)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)
  const listeningRef = useRef(listening)

  useEffect(() => { listeningRef.current = listening }, [listening])

  useEffect(() => {
    api.get('/api/settings/ai')
      .then(({ data }) => setQuality(data?.quality || 'medium'))
      .catch(() => {})
    getAiUsage()
      .then(({ used, limit }) => setAiUsage({ used, limit }))
      .catch(() => {})
  }, [])

  const changeQuality = async (q) => {
    setQuality(q)
    try { await api.put('/api/settings/ai', { quality: q }) } catch { toast.error('Failed to update AI quality') }
  }

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
    if (listening) { stopVoice(); return }
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
            <button onClick={() => { openBrowserSettings(); toast.dismiss(t.id) }} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">Open Settings</button>
            <button onClick={() => toast.dismiss(t.id)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-zinc-600">Dismiss</button>
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
      for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript
      setInput(transcript)
    }
    recognition.onerror = (event) => {
      stopVoice()
      switch (event.error) {
        case 'not-allowed': toast.error('Microphone permission was denied. Allow access in your browser settings, then reload the page.'); break
        case 'no-speech': toast.error('No speech detected. Try speaking closer to the microphone.'); break
        case 'audio-capture': toast.error('No microphone found. Check your microphone connection.'); break
        case 'network': toast.error('Network error. Check your internet connection.'); break
        case 'aborted': break
        case 'service-not-allowed': toast.error('Speech recognition is not allowed on this page. Try using HTTPS.'); break
        default: toast.error('Microphone error. Check permissions.')
      }
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening, checkMicPermission, stopVoice])

  const stopVoiceRef = useRef(stopVoice)
  useEffect(() => { stopVoiceRef.current = stopVoice }, [stopVoice])

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden && listeningRef.current) stopVoiceRef.current() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => { document.removeEventListener('visibilitychange', handleVisibility); stopVoiceRef.current() }
  }, [])

  const loadSession = useCallback(async (sid) => {
    if (listeningRef.current) stopVoiceRef.current()
    setInitialLoading(true)
    setShowSessions(false)
    try {
      const msgs = await getChatHistory(sid)
      setMessages(msgs.length > 0 ? msgs : [defaultMessage])
      setSessionId(sid)
    } catch { setMessages([defaultMessage]) }
    finally { setInitialLoading(false) }
  }, [])

  useEffect(() => {
    getChatSessions()
      .then(s => { setSessions(s); if (s.length > 0) loadSession(s[0]._id); else setInitialLoading(false) })
      .catch(() => setInitialLoading(false))
  }, [loadSession])

  const newChat = useCallback(async () => {
    if (listeningRef.current) stopVoiceRef.current()
    const sid = genId()
    setSessionId(sid)
    setMessages([defaultMessage])
    setShowSessions(false)
  }, [])

  useEffect(() => { if (!initialLoading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, initialLoading])

  const handleSend = async (text) => {
    const msgText = text || input
    if (!msgText.trim() || loading) return
    setInput('')
    setLoading(true)
    const userMsg = { sessionId, role: 'user', text: msgText }
    try {
      const savedUser = await saveChatMessage(userMsg)
      setMessages(prev => [...prev, savedUser])
      const res = await chatAI(msgText, sessionId, mode)
      const savedAI = await saveChatMessage({
        sessionId, role: 'ai', text: res.reply, tasks: res.tasks || [], createdTasks: res.createdTasks || [],
      })
      setMessages(prev => [...prev, savedAI])
      getChatSessions().then(s => setSessions(s)).catch(() => {})
    } catch (err) {
      const errMsg = err?.response?.status === 503 ? "AI service quota exceeded. Please try again later." : 'Sorry, something went wrong. Try again.'
      const savedErr = await saveChatMessage({ sessionId, role: 'ai', text: errMsg }).catch(() => null)
      setMessages(prev => [...prev, savedErr || { role: 'ai', text: errMsg }])
    } finally { setLoading(false) }
  }

  const handleDeleteMessage = async (id) => {
    try { await deleteChatMessage(id); setMessages(prev => prev.filter(m => m._id !== id)); toast.success('Message deleted') }
    catch { toast.error('Failed to delete message') }
  }

  const handleDeleteSession = async (sid) => {
    try {
      await clearChatHistory(sid)
      setSessions(prev => prev.filter(s => s._id !== sid))
      if (sessionId === sid) newChat()
      toast.success('Session deleted')
    } catch { toast.error('Failed to delete session') }
  }

  const handleCreateTask = async (task, msgIndex) => {
    setCreating(msgIndex)
    try {
      const created = await createTask({
        title: task.title, description: task.description || '', priority: task.priority || 'medium', deadline: task.deadline || null,
      })
      setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, createdTasks: [...(m.createdTasks || []), created] } : m))
      toast.success(`Task created: ${task.title}`)
    } catch { toast.error('Failed to create task') }
    finally { setCreating(null) }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <Helmet>
        <title>AI Chat - FlowSync AI</title>
        <meta name="description" content="Chat with AI to plan tasks" />
      </Helmet>

      {/* Overlay for mobile sidebar */}
      {showSessions && <div className="md:hidden fixed inset-0 bg-black/40 z-10" onClick={() => setShowSessions(false)} />}

      {/* Sidebar */}
      <div className={`${showSessions ? 'fixed md:flex z-20' : 'hidden'} md:flex flex-col w-64 flex-shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-indigo-100/50 dark:border-zinc-800/50`}>
            <div className="flex items-center justify-between px-4 h-14 border-b border-indigo-100/50 dark:border-zinc-800/50 bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <History size={15} className="text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chat History</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={newChat}
                className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                title="New Chat"
              >
                <Plus size={15} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {sessions.map(s => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    sessionId === s._id
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200/50 dark:ring-indigo-700/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  onClick={() => loadSession(s._id)}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    sessionId === s._id ? 'bg-indigo-200/50 dark:bg-indigo-700/30' : 'bg-slate-100 dark:bg-zinc-800'
                  }`}>
                    <MessageSquare size={12} className={sessionId === s._id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${sessionId === s._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      {s.preview?.length > 40 ? s.preview.slice(0, 40) + '...' : s.preview}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{s.messageCount} msg</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">·</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(s.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteSession(s._id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                    title="Delete session"
                  >
                    <X size={11} />
                  </button>
                </motion.div>
              ))}
              {sessions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                    <MessageSquare size={22} className="text-indigo-300 dark:text-indigo-600" />
                  </div>
                  <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">No previous chats</p>
                  <p className="text-[10px] text-slate-300 dark:text-zinc-700 mt-1">Start a conversation to see it here</p>
                </div>
              )}
            </div>
          </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 border-b border-indigo-100/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors"
              onClick={() => setShowSessions(!showSessions)}
            >
              {showSessions ? <X size={18} /> : <MessageSquare size={18} />}
            </motion.button>
            <div className="w-10 h-10 rounded-xl bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">AI Assistant</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">Plan, organize, and create tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {aiUsage && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-[10px] font-medium text-slate-500 dark:text-slate-400" title="AI calls used today">
                <Sparkles size={11} className="text-indigo-500" />
                {aiUsage.used}/{aiUsage.limit} today
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(mode === 'fun' ? 'normal' : 'fun')}
              title={mode === 'fun' ? 'Fun Mode ON — jokes, games & entertainment' : 'Fun Mode OFF — productivity assistant'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${mode === 'fun'
                ? 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-md shadow-fuchsia-500/20'
                : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700/60 text-slate-500 dark:text-slate-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700/60 hover:text-fuchsia-600 dark:hover:text-fuchsia-400'}`}
            >
              <PartyPopper size={12} className={mode === 'fun' ? 'text-white' : ''} />
              {mode === 'fun' ? 'Fun ON' : 'Fun Mode'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(mode === 'gf' ? 'normal' : 'gf')}
              title={mode === 'gf' ? 'Companion Mode ON — warm, caring girlfriend chat' : 'Companion Mode OFF'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${mode === 'gf'
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700/60 text-slate-500 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700/60 hover:text-rose-600 dark:hover:text-rose-400'}`}
            >
              <Heart size={12} className={mode === 'gf' ? 'text-white' : ''} />
              {mode === 'gf' ? 'Companion ON' : 'Companion'}
            </motion.button>
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 shadow-sm" title="AI model quality — choose response speed vs intelligence">
              {[['low', 'Fast'], ['medium', 'Balanced'], ['high', 'Smart']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => changeQuality(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${quality === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {messages.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={newChat}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-700"
              >
                <Trash2 size={14} /> New Chat
              </motion.button>
            )}
          </div>
        </div>

        {/* Messages */}
        {initialLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
              <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">Loading conversations...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 scrollbar-thin">
              {messages.map((msg, i) => (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex gap-3"
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200/30 dark:shadow-indigo-900/30 mt-0.5">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div className="flex items-start gap-2">
                        {msg.role === 'user' && (
                          <div className="order-last w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                        )}
                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`relative px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[70%]'
                              : 'bg-white dark:bg-zinc-800/90 border border-slate-100 dark:border-zinc-700/50 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm max-w-[90%] md:max-w-[75%]'
                          }`}>
                            {msg.text}
                          </div>
                          {msg._id && (
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete message"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {msg.role === 'ai' && msg.tasks && msg.tasks.length > 0 && (
                        <div className="mt-3 space-y-2 ml-10">
                          {msg.tasks.map((task, j) => {
                            const alreadyCreated = (msg.createdTasks || []).some(ct => ct.title === task.title)
                            return (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: j * 0.05 }}
                                className="bg-white dark:bg-zinc-800/90 border border-slate-100 dark:border-zinc-700/50 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow max-w-lg"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                      task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                      task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                    }`}>{task.priority || 'medium'}</span>
                                    {task.deadline && <span className="text-[10px] text-slate-400 dark:text-slate-500">{task.deadline}</span>}
                                  </div>
                                </div>
                                {alreadyCreated ? (
                                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg">
                                    <Check size={13} /> Created
                                  </span>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleCreateTask(task, i)}
                                    disabled={creating === i}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition-all disabled:opacity-50 flex-shrink-0 shadow-sm"
                                  >
                                    {creating === i ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                    Create
                                  </motion.button>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 border border-slate-100 dark:border-zinc-700/50 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:'0s'}} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:'0.15s'}} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:'0.3s'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={11} /> {mode === 'fun' ? 'Fun Mode — try asking' : mode === 'gf' ? 'Companion Mode — try asking' : 'Try asking'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(mode === 'fun' ? funSuggestions : mode === 'gf' ? gfSuggestions : suggestions).map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(s.text)}
                      disabled={loading}
                      className="group relative overflow-hidden text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/50 text-slate-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <div className={`absolute inset-0 ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <s.icon size={12} className="relative z-10" />
                      <span className="relative z-10">{s.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-indigo-100/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex-shrink-0">
              {listening && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 mb-3 text-xs font-medium"
                >
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{animationDelay:'0.2s'}} />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{animationDelay:'0.4s'}} />
                  </span>
                  <span className="text-red-500">Listening...</span>
                  <span className="text-slate-400 dark:text-slate-500">Speak now, I'm all ears</span>
                </motion.div>
              )}
              <div className="flex gap-2.5">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder={listening ? 'Speak now...' : mode === 'fun' ? 'Ask me for jokes, games, memes...' : mode === 'gf' ? 'Talk to me...' : 'Ask me anything...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 focus:border-indigo-400 dark:focus:border-indigo-500 text-sm transition-all shadow-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoice}
                  disabled={loading}
                  className={`relative px-3.5 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 shadow-sm ${
                    listening
                      ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                      : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-700'
                  }`}
                  title={listening ? 'Tap to stop recording' : 'Voice input'}
                >
                  {listening ? <MicOff size={17} /> : <Mic size={17} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md shadow-indigo-200/30 dark:shadow-indigo-900/30"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIPlanner
