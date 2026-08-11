import { createContext, useEffect, useContext, useReducer } from 'react'
import { login as loginService, register as registerService } from '../services/authService'
import api from '../services/api'

const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT': return { ...state, user: action.user, loading: false }
    case 'LOGIN': return { ...state, user: action.user }
    case 'UPDATE_USER': return { ...state, user: action.user }
    case 'LOGOUT': return { ...state, user: null }
    default: return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true })

  useEffect(() => {
    let user = null
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      user = storedUser && token ? JSON.parse(storedUser) : null
    } catch {
      localStorage.removeItem('user')
    }
    dispatch({ type: 'INIT', user })
  }, [])

  const persistSession = (data) => {
    localStorage.setItem('token', data.token)
    try {
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch {
      const slim = { ...data.user }
      delete slim.profilePicture
      try { localStorage.setItem('user', JSON.stringify(slim)) } catch {}
    }
  }

  const login = async (email, password) => {
    const data = await loginService({ email, password })
    persistSession(data)
    dispatch({ type: 'LOGIN', user: data.user })
    return data
  }

  const register = async (name, email, password) => {
    const data = await registerService({ name, email, password })
    if (data.token) {
      persistSession(data)
      dispatch({ type: 'LOGIN', user: data.user })
    }
    return data
  }

  const setUser = (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch {
      const slim = { ...user }
      delete slim.profilePicture
      try { localStorage.setItem('user', JSON.stringify(slim)) } catch {}
    }
    dispatch({ type: 'UPDATE_USER', user })
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // best-effort: revoke server-side even if network fails silently
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
