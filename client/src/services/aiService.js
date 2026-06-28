import api from './api'

export const prioritizeTask = async (taskData) => {
  const { data } = await api.post('/api/ai/prioritize', taskData)
  return data
}

export const scheduleTask = async (taskData) => {
  const { data } = await api.post('/api/ai/schedule', taskData)
  return data
}
