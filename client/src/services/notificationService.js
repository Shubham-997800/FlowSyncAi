import api from './api'

// API functions for fetching and managing notifications
export const getNotifications = async () => {
  const { data } = await api.get('/api/notifications', { params: { limit: 1000 } })
  return data
}

export const markAsRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}/read`)
  return data
}

export const markAllRead = async () => {
  const { data } = await api.put('/api/notifications/read-all')
  return data
}

export const createNotification = async (payload) => {
  const { data } = await api.post('/api/notifications', payload)
  return data
}
