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
