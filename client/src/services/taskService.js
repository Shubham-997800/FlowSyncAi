import api from './api'

export const getTasks = async () => {
  const { data } = await api.get('/api/tasks')
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
