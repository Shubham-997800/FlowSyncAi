import api from './api'

// API functions for tasks CRUD operations
// Optional filters: { status, priority, q (title search), due: 'today', page, limit }
export const getTasks = async (params = {}) => {
  const { data } = await api.get('/api/tasks', { params: { limit: 1000, ...params } })
  return data
}

export const createTask = async (taskData) => {
  const { data } = await api.post('/api/tasks', taskData)
  return data
}

export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/api/tasks/${id}`, taskData)
  return data
}

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/api/tasks/${id}`)
  return data
}
