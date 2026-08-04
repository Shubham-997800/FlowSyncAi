import { randomUUID } from 'node:crypto'

export const API_BASE = 'http://localhost:5000'

export async function signupUser(request) {
  const email = `e2e-${randomUUID()}@test.com`
  const password = 'Password123!'
  const res = await request.post(`${API_BASE}/api/auth/signup`, {
    data: { name: 'E2E User', email, password },
  })
  if (res.status() !== 201) throw new Error(`signup failed: ${res.status()} ${await res.text()}`)
  const body = await res.json()
  return { email, password, token: body.token, refreshToken: body.refreshToken, user: body.user, id: body.user._id }
}

export async function createTask(request, token, task) {
  const res = await request.post(`${API_BASE}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title: 'E2E Task', priority: 'medium', ...task },
  })
  if (res.status() !== 201) throw new Error(`task create failed: ${res.status()} ${await res.text()}`)
  return (await res.json())._id
}

export async function seedSession(page, session) {
  await page.addInitScript(({ token, refreshToken, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('flowsync_onboard_shown_v1', '1')
  }, { token: session.token, refreshToken: session.refreshToken, user: session.user })
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
