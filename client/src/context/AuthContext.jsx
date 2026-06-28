import { createContext, useEffect, useContext, useReducer } from 'react'
import { login as loginService, register as registerService } from '../services/authService'

const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT': return { ...state, user: action.user, loading: false }
    case 'LOGIN': return { ...state, user: action.user }
    case 'LOGOUT': return { ...state, user: null }
    default: return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    dispatch({ type: 'INIT', user: storedUser && token ? JSON.parse(storedUser) : null })
  }, [])

  const login = async (email, password) => {
    const data = await loginService({ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    dispatch({ type: 'LOGIN', user: data.user })
    return data
  }

  const register = async (name, email, password) => {
    const data = await registerService({ name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    dispatch({ type: 'LOGIN', user: data.user })
    return data
  }

  const demoLogin = () => {
    const demoUser = { name: 'Demo User', email: 'demo@flowsync.ai', _id: 'demo-user-id' }
    const token = 'demo-token'
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(demoUser))
    dispatch({ type: 'LOGIN', user: demoUser })
    return { user: demoUser, token }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading, login, register, demoLogin, logout }}>
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
