import api from './api'

export const getProfile = async () => {
  const { data } = await api.get('/api/settings/profile')
  return data
}

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/api/settings/profile', profileData)
  return data
}

export const updatePassword = async (passwordData) => {
  const { data } = await api.put('/api/settings/password', passwordData)
  return data
}

export const deleteAccount = async () => {
  const { data } = await api.delete('/api/settings/account')
  return data
}
