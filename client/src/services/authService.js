import api from './api'

// API functions for authentication (login, register, password reset)
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

export const verifyEmail = async (email, otp) => {
  const { data } = await api.post('/api/auth/verify-email', { email, otp })
  return data
}

export const resendOTP = async (email) => {
  const { data } = await api.post('/api/auth/resend-otp', { email })
  return data
}
