import { useState, useRef, useEffect, useCallback } from 'react'
import { Brain, Send, Loader2, Plus, Check, User, Sparkles, Trash2, X, MessageSquare, Mic, MicOff, History, Zap, Clock, Calendar, CornerDownRight, CheckCircle2, Trash, PencilLine, Square } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { streamChatAI, getAiUsage } from '../../services/aiService'
import { createTask } from '../../services/taskService'
import { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory } from '../../services/chatService'
import Markdown from '../../components/ui/Markdown'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { openBrowserSettings } from '../../utils/permissions'

const defaultMessage = { role: 'ai', text: "Hi! I'm your AI assistant. Tell me what you're working on, or ask me to create tasks for you." }

const qualityOptions = [
  { value: 'low', label: 'Fast', desc: 'Quick replies' },
  { value: 'medium', label: 'Balanced', desc: 'Recommended' },
  { value: 'high', label: 'Smart', desc: 'Deep thinking' },
]

const suggestions = [
  { icon: Sparkles, text: 'Create a task to finish my project report', color: 'bg-violet-500/10' },
  { icon: Calendar, text: 'I have a math exam next week, help me plan', color: 'bg-blue-500/10' },
  { icon: Zap, text: 'Add a high priority task for team meeting tomorrow', color: 'bg-amber-500/10' },
  { icon: Clock, text: 'What tasks are overdue?', color: 'bg-rose-500/10' },
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

const actionMeta = {
  complete: { label: 'Completed', Icon: CheckCircle2, cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
  in_progress: { label: 'Started', Icon: PencilLine, cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  pending: { label: 'Reopened', Icon: CornerDownRight, cls: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400' },
  update: { label: 'Updated', Icon: PencilLine, cls: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  delete: { label: 'Deleted', Icon: Trash, cls: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
}

function AIPlanner() {
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState(genId)
  const [sessions, setSessions] = useState([])
  const [messages, setMessages] = useState([defaultMessage])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [creating, setCreating] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showSessions, setShowSessions] = useState(false)
  const [listening, setListening] = useState(false)
  const [aiUsage, setAiUsage] = useState(null)
  const [quality, setQuality] = useState(() => localStorage.getItem('flowsync_ai_quality') || 'medium')
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)
  const listeningRef = useRef(listening)
  const autoRestartRef = useRef(false)
  const silenceTimerRef = useRef(null)
  const lastSpeechRef = useRef(0)
  const finalTranscriptRef = useRef('')
  const handleSendRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => { listeningRef.current = listening }, [listening])

  const setQualityAndStore = (q) => { setQuality(q); localStorage.setItem('flowsync_ai_quality', q) }

  useEffect(() => {
    getAiUsage()
      .then(({ used, limit }) => setAiUsage({ used, limit }))
      .catch(() => {})
  }, [])

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

  const stopVoice = useCallback(({ send = false } = {}) => {
    autoRestartRef.current = false
    clearTimeout(silenceTimerRef.current)
    const rec = recognitionRef.current
    if (rec) {
      rec.onend = null
      try { rec.stop() } catch {}
    }
    recognitionRef.current = null
    setListening(false)
    const text = finalTranscriptRef.current
    finalTranscriptRef.current = ''
    if (send && text.trim() && handleSendRef.current) {
      handleSendRef.current(text.trim())
    }
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
    finalTranscriptRef.current = ''
    autoRestartRef.current = true

    const scheduleSilenceCheck = () => {
      clearTimeout(silenceTimerRef.current)
      lastSpeechRef.current = Date.now()
      silenceTimerRef.current = setTimeout(() => {
        if (autoRestartRef.current && Date.now() - lastSpeechRef.current >= 1800 && finalTranscriptRef.current.trim()) {
          stopVoice({ send: true })
        }
      }, 1900)
    }

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + r[0].transcript
        else interim += r[0].transcript
      }
      setInput(finalTranscriptRef.current + interim)
      scheduleSilenceCheck()
    }
    recognition.onerror = (event) => {
      autoRestartRef.current = false
      stopVoice()
      switch (event.error) {
        case 'not-allowed': toast.error('Microphone permission was denied. Allow access in your browser settings, then reload the page.'); break
        case 'no-speech': if (!finalTranscriptRef.current) toast.error('No speech detected. Try speaking closer to the microphone.'); break
        case 'audio-capture': toast.error('No microphone found. Check your microphone connection.'); break
        case 'network': toast.error('Network error. Check your internet connection.'); break
        case 'aborted': break
        case 'service-not-allowed': toast.error('Speech recognition is not allowed on this page. Try using HTTPS.'); break
        default: toast.error('Microphone error. Check permissions.')
      }
    }
    recognition.onend = () => {
      clearTimeout(silenceTimerRef.current)
      if (autoRestartRef.current && listeningRef.current) {
        try { recognition.start() } catch {}
        return
      }
      recognitionRef.current = null
      setListening(false)
    }
    recognitionRef.current = recognition
    try { recognition.start() } catch { toast.error('Could not start microphone. Check permissions.'); setListening(false) }
    setListening(true)
  }, [listening, checkMicPermission, stopVoice])

  const stopVoiceRef = useRef(stopVoice)
  useEffect(() => { stopVoiceRef.current = stopVoice }, [stopVoice])

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden && listeningRef.current) stopVoiceRef.current() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      stopVoiceRef.current()
      abortRef.current?.abort()
    }
  }, [])

  const loadSession = useCallback(async (sid) => {
    if (listeningRef.current) stopVoiceRef.current()
    abortRef.current?.abort()
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
    abortRef.current?.abort()
    const sid = genId()
    setSessionId(sid)
    setMessages([defaultMessage])
    setShowSessions(false)
  }, [])

  useEffect(() => { if (!initialLoading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length, initialLoading])

const scrollAreaRef = useRef(null)
useEffect(() => {
  if (!streaming || initialLoading) return
  const el = scrollAreaRef.current
  if (!el) return
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

  const handleSend = async (text, { skipUserSave = false } = {}) => {
    const msgText = text || input
    if (!msgText.trim() || streaming) return
    setInput('')
    setStreaming(true)
    const aiId = genId()
    const placeholder = { id: aiId, role: 'ai', text: '', tasks: [], createdTasks: [], actions: [], suggestions: [], streaming: true }
    let tokenBuf = ''
    let frameQueued = false
    const flush = () => {
      frameQueued = false
      if (!tokenBuf) return
      const chunk = tokenBuf
      tokenBuf = ''
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: m.text + chunk } : m))
    }
    const appendToken = (token) => {
      if (!token) return
      tokenBuf += token
      if (!frameQueued) {
        frameQueued = true
        requestAnimationFrame(flush)
      }
    }
    const controller = new AbortController()
    abortRef.current = controller
    const optimisticUser = { id: genId(), role: 'user', text: msgText }
    if (!skipUserSave) setMessages(prev => [...prev, optimisticUser])
    try {
      let savedUser = optimisticUser
      if (!skipUserSave) {
        try {
          savedUser = await saveChatMessage({ sessionId, role: 'user', text: msgText })
        } catch {
          savedUser = optimisticUser
        }
      }
      if (!skipUserSave && savedUser !== optimisticUser) {
        setMessages(prev => prev.map(m => m.id === optimisticUser.id ? savedUser : m))
      }
      setMessages(prev => [...prev, placeholder])
      const done = await streamChatAI({
        message: msgText,
        sessionId,
        quality,
        signal: controller.signal,
        onToken: appendToken,
        onError: () => {},
      })
      flush()
      if (done && done.aborted) {
        setMessages(prev => prev.filter(m => m.id !== aiId))
        return
      }
      if (done && done.error) {
        const errText = done.message || 'Sorry, something went wrong. Try again.'
        const savedAI = await saveChatMessage({ sessionId, role: 'ai', text: errText }).catch(() => null)
        setMessages(prev => prev.map(m => m.id === aiId ? (savedAI || { ...m, text: errText, streaming: false }) : m))
        if (done.error === 'AI_DAILY_LIMIT') {
          getAiUsage().then(({ used, limit }) => setAiUsage({ used, limit })).catch(() => {})
        }
        toast.error(errText)
      } else if (done) {
        const replyText = (done.reply || '').trim()
        const finalText = replyText || (done.tasks && done.tasks.length > 0 ? '' : 'Done! What would you like to do next?')
        const savedAI = await saveChatMessage({
          sessionId,
          role: 'ai',
          text: finalText,
          tasks: done.tasks || [],
          createdTasks: done.createdTasks || [],
          actions: done.actions || [],
          suggestions: done.suggestions || [],
        })
        setMessages(prev => prev.map(m => m.id === aiId ? (savedAI || {
          ...m,
          text: finalText,
          createdTasks: done.createdTasks || [],
          actions: done.actions || [],
          suggestions: done.suggestions || [],
          streaming: false,
        }) : m))
      }
      getChatSessions().then(s => setSessions(s)).catch(() => {})
    } catch (err) {
      if (err && err.name === 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== aiId))
        return
      }
      const errText = err?.message || 'Sorry, something went wrong. Try again.'
      const savedErr = await saveChatMessage({ sessionId, role: 'ai', text: errText }).catch(() => null)
      setMessages(prev => prev.map(m => m.id === aiId ? (savedErr || { ...m, text: errText, streaming: false }) : m))
    } finally {
      frameQueued = false
      flush()
      abortRef.current = null
      setStreaming(false)
    }
  }
  useEffect(() => { handleSendRef.current = handleSend })

  const stopGeneration = () => { abortRef.current?.abort() }

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
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <Helmet>
        <title>AI Chat - FlowSync AI</title>
        <meta name="description" content="Chat with AI to plan tasks" />
      </Helmet>

      {/* Overlay for mobile sidebar */}
      {showSessions && <div className="md:hidden fixed inset-0 bg-black/40 z-10" onClick={() => setShowSessions(false)} />}

      {/* Sidebar */}
      <div className={`${showSessions ? 'fixed inset-y-0 left-0 z-20' : 'hidden'} md:flex flex-col w-64 flex-shrink-0 h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-indigo-100/50 dark:border-zinc-800/50`}>
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
                    className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors flex-shrink-0"
              onClick={() => setShowSessions(!showSessions)}
              aria-label={showSessions ? 'Close chat history' : 'Open chat history'}
              title={showSessions ? 'Close chat history' : 'Open chat history'}
            >
              {showSessions ? <X size={18} /> : <MessageSquare size={18} />}
            </motion.button>
            <div className="w-10 h-10 rounded-xl bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 flex-shrink-0">
              <Brain size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">AI Assistant</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Plan, organize, and create tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 justify-end flex-shrink-0">
            <div className="hidden sm:flex items-center rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 p-0.5 shadow-sm" role="radiogroup" aria-label="AI model quality">
              {qualityOptions.map(qo => (
                <button
                  key={qo.value}
                  role="radio"
                  aria-checked={quality === qo.value}
                  onClick={() => setQualityAndStore(qo.value)}
                  disabled={streaming}
                  title={qo.desc}
                  className={`px-2.5 py-1 rounded-[10px] text-[11px] font-medium transition-all disabled:opacity-50 ${
                    quality === qo.value
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/70 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  {qo.label}
                </button>
              ))}
            </div>
            {aiUsage && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-[10px] font-medium text-slate-500 dark:text-slate-400" title="AI calls used today">
                <Sparkles size={11} className="text-indigo-500" />
                {aiUsage.used}/{aiUsage.limit} today
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={newChat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-700"
            >
              <Trash2 size={14} /> New Chat
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        {initialLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
              <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">streaming conversations...</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 scrollbar-thin">
              {messages.map((msg, i) => (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex gap-3"
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200/30 dark:shadow-indigo-900/30 mt-0.5 overflow-hidden">
                        <img src="/favicon.svg" alt="FlowSync AI" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div className="flex items-start gap-2">
                        {msg.role === 'user' && (
                          <div className="order-last w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                            {user?.profilePicture ? <img src={user.profilePicture} alt={user.name || 'You'} className="w-full h-full object-cover" /> : <User size={14} className="text-indigo-600 dark:text-indigo-400" />}
                          </div>
                        )}
                        <div className={`flex flex-col min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`relative px-4 py-3 text-sm leading-relaxed shadow-sm break-words ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[70%] whitespace-pre-wrap'
                              : 'bg-white dark:bg-zinc-800/90 border border-slate-100 dark:border-zinc-700/50 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm max-w-[90%] md:max-w-[75%]'
                          }`}>
{msg.role === 'ai'
  ? (msg.streaming
    ? <div>
        {msg.text
          ? <Markdown>{msg.text}</Markdown>
          : (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">AI is thinking...</span>
            </div>
          )}
        <span className="inline-block w-1.5 h-4 align-middle bg-indigo-400 rounded-sm ml-0.5 animate-pulse" />
      </div>
    : <Markdown>{msg.text}</Markdown>)
  : msg.text}
                          </div>
                          {msg._id && (
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="mt-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete message"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {msg.role === 'ai' && msg.tasks && msg.tasks.length > 0 && (
                        <div className="mt-3 space-y-2 ml-0 sm:ml-10">
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
                      {msg.role === 'ai' && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 ml-0 sm:ml-10 max-w-lg">
                          {msg.actions.map((a, j) => {
                            const meta = actionMeta[a.action] || actionMeta.update
                            const ok = a.ok
                            return (
                              <span
                                key={j}
                                className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg ${
                                  ok ? meta.cls : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                <meta.Icon size={12} />
                                {ok ? `${meta.label}: ${a.title || a.taskId}` : `${a.action || 'action'} failed`}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {msg.role === 'ai' && !msg.streaming && msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                        <div className="mt-3 ml-0 sm:ml-10 flex flex-wrap gap-2 max-w-lg">
                          {msg.suggestions.slice(0, 3).map((s, j) => (
                            <motion.button
                              key={j}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: j * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSend(s)}
                              disabled={streaming}
                              className="text-xs px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-600/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                              <CornerDownRight size={11} />
                              {s}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={11} /> Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(s.text)}
                      disabled={streaming}
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
            <div className="px-4 sm:px-6 lg:px-8 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-indigo-100/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex-shrink-0">
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
                  <span className="hidden sm:inline text-slate-400 dark:text-slate-500">Speak now, auto-sends on pause</span>
                </motion.div>
              )}
              <div className="flex gap-2.5">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder={listening ? 'Speak now...' : 'Ask me anything...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 focus:border-indigo-400 dark:focus:border-indigo-500 text-sm transition-all shadow-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoice}
                  disabled={streaming}
                  className={`relative px-3.5 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 shadow-sm ${
                    listening
                      ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                      : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-700'
                  }`}
                  title={listening ? 'Tap to stop recording' : 'Voice input'}
                >
                  {listening ? <MicOff size={17} /> : <Mic size={17} />}
                </motion.button>
                {streaming ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopGeneration}
                    className="px-4 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white transition-all flex items-center justify-center shadow-md shadow-red-200/30 dark:shadow-red-900/30"
                    title="Stop generating"
                  >
                    <Square size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md shadow-indigo-200/30 dark:shadow-indigo-900/30"
                  >
                    <Send size={18} />
                  </motion.button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIPlanner
