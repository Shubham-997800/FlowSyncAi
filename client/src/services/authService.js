import api from './api'

export const register = async (userData) => {
  const { data } = await api.post('/api/auth/signup', userData)
  return data
}

export const login = async (userData) => {
  const { data } = await api.post('/api/auth/login', userData)
  return data
}

export const forgotPassword = async (email) => {
  const { data } = await api.post('/api/auth/forgot-password', { email })
  return data
}

export const resetPassword = async (token, password) => {
  const { data } = await api.post('/api/auth/reset-password', { token, password })
  return data
}
