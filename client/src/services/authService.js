import api from './api'

export const register = async (userData) => {
  const { data } = await api.post('/api/auth/register', userData)
  return data
}

export const login = async (userData) => {
  const { data } = await api.post('/api/auth/login', userData)
  return data
}
