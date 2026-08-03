import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'
import * as authService from '../services/authService'

vi.mock('../services/api', () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: {} })) },
}))

vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

function Consumer() {
  const { user, login, logout, setUser } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <button onClick={() => login('a@b.com', 'secret')}>login</button>
      <button onClick={() => logout()}>logout</button>
      <button onClick={() => setUser({ email: 'c@d.com' })}>setuser</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('restores a session from localStorage on init', async () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('refreshToken', 'xyz')
    localStorage.setItem('user', JSON.stringify({ email: 'stored@b.com' }))
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    expect(await screen.findByTestId('user')).toHaveTextContent('stored@b.com')
  })

  it('logs in, persists the session, and updates the user', async () => {
    const user = userEvent.setup()
    authService.login.mockResolvedValue({
      token: 't',
      refreshToken: 'r',
      user: { email: 'a@b.com' },
    })
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await user.click(screen.getByText('login'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('a@b.com'))
    expect(localStorage.getItem('token')).toBe('t')
    expect(localStorage.getItem('refreshToken')).toBe('r')
    expect(localStorage.getItem('user')).toContain('a@b.com')
  })

  it('logs out and clears the session', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', 'abc')
    localStorage.setItem('refreshToken', 'xyz')
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com' }))
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await user.click(screen.getByText('logout'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('none'))
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('setUser persists the updated profile', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', 'abc')
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com' }))
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await user.click(screen.getByText('setuser'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('c@d.com'))
    expect(localStorage.getItem('user')).toContain('c@d.com')
  })
})
