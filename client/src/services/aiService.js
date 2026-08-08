import api from './api'

// API functions for AI features (prioritization, chat, suggestions)
export const prioritizeTasks = async () => {
  const { data } = await api.post('/api/ai/prioritize')
  return data
}

export const chatAI = async (message, sessionId, quality) => {
  const { data } = await api.post('/api/ai/chat', { message, sessionId, quality })
  return data
}

export const streamChatAI = async ({ message, sessionId, quality, onToken, onDone, onError, onStart, signal }) => {
  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`${API_URL}/api/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      signal,
      body: JSON.stringify({ message, sessionId, quality }),
    })
    if (!res.ok) {
      let msg = `Request failed (${res.status})`
      try { const j = await res.json(); msg = j.message || j.code || msg } catch {}
      if (res.status === 401) msg = 'Session expired. Please log in again.'
      throw new Error(msg)
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop()
      for (const evt of events) {
        const line = evt.split('\n').find(l => l.startsWith('data: '))
        if (!line) continue
        let payload
        try { payload = JSON.parse(line.slice(6)) } catch { continue }
        if (payload.event === 'start') { onStart && onStart() }
        else if (payload.token) { onToken && onToken(payload.token) }
        else if (payload.done) { onDone && onDone(payload); return payload }
        else if (payload.error) { onError && onError(payload); return payload }
      }
    }
    onError && onError({ error: 'SERVER_ERROR', message: 'Stream ended unexpectedly. Please try again.' })
  } catch (err) {
    if (err && err.name === 'AbortError') {
      onDone && onDone({ aborted: true })
      return
    }
    onError && onError({ error: 'NETWORK_ERROR', message: err.message || 'Network error. Check your connection.' })
  }
}

export const suggestTask = async (title) => {
  const { data } = await api.post('/api/ai/suggest-task', { title })
  return data
}

export const getAiUsage = async () => {
  const { data } = await api.get('/api/ai/usage')
  return data
}

export const getAnalyticsInsights = async () => {
  const { data } = await api.get('/api/ai/analytics-insights')
  return data
}

export const getHabitInsights = async () => {
  const { data } = await api.get('/api/ai/habit-insights')
  return data
}

export const getFocusSuggestion = async (taskId) => {
  const { data } = await api.post('/api/ai/focus-suggest', { taskId })
  return data
}

export const getProfileInsights = async () => {
  const { data } = await api.get('/api/ai/profile-insights')
  return data
}

export const organizeNotifications = async (notifications) => {
  const { data } = await api.post('/api/ai/organize-notifications', { notifications })
  return data
}
