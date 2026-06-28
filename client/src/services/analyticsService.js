import api from './api'

export const getAnalytics = async () => {
  const { data } = await api.get('/api/analytics')
  return data
}

export const getWeeklyReport = async () => {
  const { data } = await api.get('/api/analytics/weekly')
  return data
}
