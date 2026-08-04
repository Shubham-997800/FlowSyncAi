import api from './api'

// API functions for AI features (prioritization, chat, suggestions)
export const prioritizeTasks = async () => {
  const { data } = await api.post('/api/ai/prioritize')
  return data
}

export const chatAI = async (message, sessionId, mode = 'normal') => {
  const { data } = await api.post('/api/ai/chat', { message, sessionId, mode })
  return data
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
