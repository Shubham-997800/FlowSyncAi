import api from './api'

export const getNotifications = async () => {
  const { data } = await api.get('/api/notifications')
  return data
}

export const markAsRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}`)
  return data
}

export const markAllAsRead = async () => {
  const { data } = await api.put('/api/notifications/read-all')
  return data
}

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/api/notifications/${id}`)
  return data
}
