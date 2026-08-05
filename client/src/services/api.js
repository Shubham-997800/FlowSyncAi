import axios from 'axios'

// Axios instance with auth interceptor and base URL config.
// Frontend and backend are served from the same Vercel domain, so production uses
// relative /api calls (same origin). VITE_API_URL overrides for local/custom setups.
const PROD_API = ''
const DEV_API = 'http://localhost:5000'
const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? DEV_API : PROD_API)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  // Send the httpOnly refresh-token cookie on cross-origin requests (local
  // dev: 5173 -> 5000). Same-origin requests include cookies regardless.
  withCredentials: true,
})

const MAX_RETRIES = 2
const RETRYABLE_STATUS = [408, 500, 502, 503, 504]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryable = (error) =>
  !error.config?._retried &&
  error.config?.method !== 'post' &&
  (error.response ? RETRYABLE_STATUS.includes(error.response.status) : true)

let refreshPromise = null
let lastRefreshError = null

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

const attemptRefresh = async () => {
  // Refresh token lives in an httpOnly cookie — the client never sees it, so
  // it can't be exfiltrated by an XSS payload from localStorage.
  lastRefreshError = null
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.token
  } catch (err) {
    lastRefreshError = err
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
      // Refresh failed. Only hard-logout when the token is genuinely invalid
      // (401/403). Transient failures (429 / 5xx / network) must NOT kick the
      // user out mid-refresh — the request fails silently and retries later.
      const rs = lastRefreshError?.response?.status
      if (rs === 401 || rs === 403) {
        clearSession()
      }
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      clearSession()
    }
    if (isRetryable(error)) {
      original._retried = true
      const retries = original._retryCount || 0
      if (retries < MAX_RETRIES) {
        original._retryCount = retries + 1
        await sleep(300 * 2 ** retries)
        return api(original)
      }
    }
    return Promise.reject(error)
  },
)

// Deduplicate identical in-flight GET requests (e.g. Dashboard + AIRecommendation
// both fetching /api/tasks, Sidebar + NotificationPopup both fetching
// /api/notifications). This halves API chatter on every page load and reduces
// pressure on rate limits during rapid refreshes.
const inflightGets = new Map()
const _get = api.get.bind(api)
api.get = (url, config = {}) => {
  const key = `${url}|${config.params ? JSON.stringify(config.params) : ''}`
  const existing = inflightGets.get(key)
  if (existing) return existing
  const promise = _get(url, config).finally(() => { inflightGets.delete(key) })
  inflightGets.set(key, promise)
  return promise
}

export default api
