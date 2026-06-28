import api from './api'

export const getNotifications = async () => {
  const { data } = await api.get('/api/notifications')
  return data
}

export const markAsRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}/read`)
  return data
}
