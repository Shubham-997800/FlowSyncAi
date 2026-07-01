import api from './api'

export const getChatHistory = async () => {
  const { data } = await api.get('/api/chat')
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

export const clearChatHistory = async () => {
  const { data } = await api.delete('/api/chat/clear')
  return data
}
