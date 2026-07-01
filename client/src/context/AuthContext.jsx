import { createContext, useEffect, useContext, useReducer } from 'react'
import { login as loginService, register as registerService, verifyEmail as verifyEmailService, resendOTP as resendOTPService } from '../services/authService'

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
    return data
  }

  const verifyEmail = async (email, otp) => {
    const data = await verifyEmailService(email, otp)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    dispatch({ type: 'LOGIN', user: data.user })
    return data
  }

  const resendOTP = async (email) => {
    const data = await resendOTPService(email)
    return data
  }

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'UPDATE_USER', user })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading, login, register, logout, setUser, verifyEmail, resendOTP }}>
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
