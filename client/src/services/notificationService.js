import api from './api'

export const getNotifications = async () => {
  const { data } = await api.get('/api/notifications')
  return data
}

export const markAsRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}/read`)
  return data
}

export const createNotification = async (payload) => {
  const { data } = await api.post('/api/notifications', payload)
  return data
}
