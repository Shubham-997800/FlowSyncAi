import axios from 'axios'

const PROD_API = 'https://flowsync-ai-production.up.railway.app'
const DEV_API = 'http://localhost:5000'
const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? DEV_API : PROD_API)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
