import api from './api'

// API functions for goals CRUD operations
export const getGoals = async () => {
  const { data } = await api.get('/api/goals')
  return data
}

export const createGoal = async (goalData) => {
  const { data } = await api.post('/api/goals', goalData)
  return data
}

export const updateGoal = async (id, goalData) => {
  const { data } = await api.put(`/api/goals/${id}`, goalData)
  return data
}

export const deleteGoal = async (id) => {
  const { data } = await api.delete(`/api/goals/${id}`)
  return data
}
