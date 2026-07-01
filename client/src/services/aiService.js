import api from './api'

export const prioritizeTasks = async () => {
  const { data } = await api.post('/api/ai/prioritize')
  return data
}

export const chatAI = async (message) => {
  const { data } = await api.post('/api/ai/chat', { message })
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
