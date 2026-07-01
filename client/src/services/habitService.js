import api from './api'

// API functions for habits CRUD operations
export const getHabits = async () => {
  const { data } = await api.get('/api/habits')
  return data
}

export const createHabit = async (habitData) => {
  const { data } = await api.post('/api/habits', habitData)
  return data
}

export const updateHabit = async (id, habitData) => {
  const { data } = await api.put(`/api/habits/${id}`, habitData)
  return data
}

export const deleteHabit = async (id) => {
  const { data } = await api.delete(`/api/habits/${id}`)
  return data
}
