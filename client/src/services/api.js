import axios from 'axios'

// Axios instance with auth interceptor and base URL config.
// VITE_API_URL overrides everything; otherwise dev uses localhost, prod uses the Vercel backend.
const PROD_API = 'https://flowsync-backend.vercel.app'
const DEV_API = 'http://localhost:5000'
const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? DEV_API : PROD_API)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

const attemptRefresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken })
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.token
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      if (!refreshPromise) {
        refreshPromise = attemptRefresh().finally(() => { refreshPromise = null })
      }
      const newToken = await refreshPromise
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    if (error.response?.status === 401) {
      clearSession()
    }
    return Promise.reject(error)
  },
)

export default api
