import api from './api'

export const getChatSessions = async () => {
  const { data } = await api.get('/api/chat/sessions')
  return data
}

export const getChatHistory = async (sessionId) => {
  const params = sessionId ? { sessionId } : {}
  const { data } = await api.get('/api/chat', { params })
  return data
}

export const saveChatMessage = async (message) => {
  const { data } = await api.post('/api/chat', message)
  return data
}

export const deleteChatMessage = async (id) => {
  const { data } = await api.delete(`/api/chat/${id}`)
  return data
}

export const clearChatHistory = async (sessionId) => {
  const params = sessionId ? { sessionId } : {}
  const { data } = await api.delete('/api/chat/clear', { params })
  return data
}
