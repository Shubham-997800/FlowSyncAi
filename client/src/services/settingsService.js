import api from './api'

// API functions for profile, password, avatar, and account settings
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

export const uploadAvatar = async (profilePicture) => {
  const { data } = await api.put('/api/settings/avatar', { profilePicture })
  return data
}

export const deleteAccount = async ({ password }) => {
  const { data } = await api.delete('/api/settings/account', { data: { password } })
  return data
}
