import api from './api'

export const prioritizeTasks = async () => {
  const { data } = await api.post('/api/ai/prioritize')
  return data
}

export const chatAI = async (message) => {
  const { data } = await api.post('/api/ai/chat', { message })
  return data
}
