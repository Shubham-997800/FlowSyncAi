import api from './api'

export const getWeeklyReport = async () => {
  const { data } = await api.get('/api/analytics/weekly')
  return data
}

export const getMonthlyReport = async () => {
  const { data } = await api.get('/api/analytics/monthly')
  return data
}

export const getTaskStats = async () => {
  const { data } = await api.get('/api/analytics/stats')
  return data
}
