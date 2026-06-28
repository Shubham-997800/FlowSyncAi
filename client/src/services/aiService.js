import api from './api'

export const generatePlan = async (prompt) => {
  const { data } = await api.post('/api/ai/plan', { prompt })
  return data
}

export const prioritizeTasks = async () => {
  const { data } = await api.post('/api/ai/prioritize')
  return data
}

export const rescueMode = async () => {
  const { data } = await api.post('/api/ai/rescue')
  return data
}
