/* FlowSync AI — Live End-to-End QA Test Harness
 * Boots the real production entrypoint (api/index.js, same as Vercel) against
 * an in-memory MongoDB and exercises every route, auth flow, security vector
 * and DB integrity rule. Node 18+ (uses global fetch). */

process.env.MONGOMS_VERSION = '6.0.9'

process.env.JWT_SECRET = 'qa-test-'.padEnd(64, 'x')
process.env.CLIENT_URL = 'http://localhost:5173'
process.env.OPENROUTER_API_KEY = '' // AI endpoints tested for graceful failure
process.env.VAPID_PUBLIC_KEY = 'BKdx_test_public_key_test_public_key_test_public_key_123'
process.env.VAPID_PRIVATE_KEY = 'test_private_key_test_private_key_test_private'
process.env.NODE_ENV = 'test'
process.env.REMINDER_CHECK_INTERVAL = '86400000' // effectively off during API tests
process.env.PORT = '0'
process.env.RATE_LIMIT_AUTH = '1000'
process.env.RATE_LIMIT_AI = '1000'
process.env.RATE_LIMIT_GENERAL = '1000'
process.env.RATE_LIMIT_LOGIN = '1000' // raised; the login limiter itself is tested last with a fresh app

const webpush = require('web-push')
const vapid = webpush.generateVAPIDKeys()
process.env.VAPID_PUBLIC_KEY = vapid.publicKey
process.env.VAPID_PRIVATE_KEY = vapid.privateKey

const { MongoMemoryServer } = require('mongodb-memory-server')
const http = require('http')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const dbPath = path.join('C:/Users/SHUBH/AppData/Local/Temp/opencode', 'mongo-data-' + Date.now())
fs.mkdirSync(dbPath, { recursive: true })

const results = []
const errors = []

function log(name, ok, detail) {
  results.push({ name, ok, detail })
  const mark = ok ? 'PASS' : 'FAIL'
  console.log(`[${mark}] ${name}${detail ? ` :: ${detail}` : ''}`)
  if (!ok) errors.push(`[FAIL] ${name} :: ${detail}`)
}

async function t(name, fn) {
  try {
    const res = await fn()
    log(name, res === true, res === true ? undefined : res)
  } catch (e) {
    log(name, false, `EXCEPTION: ${e.message}`)
  }
}

let server, base

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let data = null
  const raw = await res.text()
  try { data = JSON.parse(raw) } catch { data = raw }
  return { status: res.status, data, headers: res.headers }
}

async function bootServer() {
  const handler = require('../api/index')
  const srv = http.createServer(handler)
  await new Promise((resolve) => srv.listen(0, '127.0.0.1', resolve))
  return { srv, url: `http://127.0.0.1:${srv.address().port}` }
}

async function main() {
  const mongo = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  })
  process.env.MONGODB_URI = mongo.getUri()
  console.log('Mongo up')

  const boot = await bootServer()
  server = boot.srv
  base = boot.url
  console.log('API up:', base)

  const mongoose = require('mongoose')
  const User = require('../models/User')
  const Task = require('../models/Task')
  const Goal = require('../models/Goal')
  const Habit = require('../models/Habit')
  const Notification = require('../models/Notification')
  const PushSubscription = require('../models/PushSubscription')
  const ChatMessage = require('../models/ChatMessage')
  const AiUsage = require('../models/AiUsage')

  let userA, tokenA, refreshTokenA, userB, tokenB

  // ============ 1. HEALTH / HOST ============
  console.log('\n===== 1. HEALTH & HOST =====')
  await t('GET / returns service message', async () => {
    const r = await request('/')
    return r.status === 200 && r.data.message === 'FlowSync AI API is running'
  })
  await t('GET /api/health reports ok + db state', async () => {
    const r = await request('/api/health')
    return r.status === 200 && r.data.status === 'ok' && typeof r.data.database === 'string' && typeof r.data.uptime === 'number'
  })
  await t('GET / returns X-Request-ID header', async () => {
    const r = await request('/')
    return !!r.headers.get('x-request-id')
  })
  await t('Helmet security headers present', async () => {
    const r = await request('/')
    return r.headers.get('x-content-type-options') === 'nosniff' &&
      !!r.headers.get('strict-transport-security') &&
      !!r.headers.get('referrer-policy')
  })
  await t('CORS allows configured origin', async () => {
    const r = await request('/', { headers: { Origin: 'http://localhost:5173' } })
    return r.headers.get('access-control-allow-origin') === 'http://localhost:5173'
  })
  await t('CORS does NOT reflect unknown origin', async () => {
    const r = await request('/', { headers: { Origin: 'https://evil.example' } })
    return r.headers.get('access-control-allow-origin') !== 'https://evil.example'
  })
  await t('Unknown route -> Express 404', async () => {
    const r = await request('/api/nonexistent')
    return r.status === 404
  })

  // ============ 2. SIGNUP ============
  console.log('\n===== 2. AUTH: SIGNUP =====')
  await t('Signup valid user A -> 201 + token', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'User A', email: 'usera@test.com', password: 'Password123!' },
    })
    if (r.status !== 201 || !r.data.token) return `status=${r.status}`
    userA = r.data.user
    tokenA = r.data.token
    return true
  })
  await t('Signup response does NOT leak password hash', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'User Leak', email: 'leak@test.com', password: 'Password123!' },
    })
    return !r.data?.user?.password
  })
  await t('Duplicate email -> 400', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'User A2', email: 'usera@test.com', password: 'Password123!' },
    })
    return r.status === 400
  })
  await t('Missing fields rejected', async () => {
    const r = await request('/api/auth/signup', { method: 'POST', body: { name: 'NoPass' } })
    return r.status >= 400
  })
  await t('Invalid email rejected', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'X', email: 'not-an-email', password: 'Password123!' },
    })
    return r.status >= 400
  })
  await t('Weak password (no uppercase/number) rejected', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'X', email: 'weak@test.com', password: 'password' },
    })
    return r.status >= 400
  })
  await t('Name XSS stripped on API (sanitized)', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: '<script>alert(1)</script>', email: 'xss@test.com', password: 'Password123!' },
    })
    return r.status === 201 && !String(r.data.user.name).includes('<script>')
  })
  await t('Task title XSS stripped on API', async () => {
    const r = await request('/api/auth/login', { method: 'POST', body: { email: 'xss@test.com', password: 'Password123!' } })
    if (r.status !== 200) return `login status=${r.status}`
    const c = await request('/api/tasks', {
      method: 'POST',
      token: r.data.token,
      body: { title: '<script>alert(2)</script><iframe src=x></iframe>', priority: 'high' },
    })
    return c.status === 201 && !String(c.data.title).includes('<script>') && !String(c.data.title).includes('<iframe')
  })
  await t('Empty request body -> no 500', async () => {
    const r = await request('/api/auth/signup', { method: 'POST', body: {} })
    return r.status !== 500
  })

  // ============ 3. LOGIN ============
  console.log('\n===== 3. AUTH: LOGIN =====')
  await t('Login valid -> 200 + token', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'Password123!' },
    })
    if (r.status !== 200 || !r.data.token) return `status=${r.status}`
    tokenA = r.data.token
    return true
  })
  await t('Login response does NOT leak password hash', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'Password123!' },
    })
    return !r.data?.user?.password
  })
  await t('Wrong password -> 401', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'WrongPass1!' },
    })
    return r.status === 401
  })
  await t('Nonexistent user -> 401 (uniform message)', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'ghost@test.com', password: 'Whatever1!' },
    })
    return r.status === 401
  })
  await t('NoSQL injection (email {$gt:""}) blocked cleanly', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: { $gt: '' }, password: { $gt: '' } },
    })
    if (r.status === 200) return `AUTH BYPASS status=200`
    if (r.status >= 500) return `responded 500 (should be 4xx)`
    return true
  })
  await t('Wrong Content-Type handled (no 500)', async () => {
    const res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'email=usera@test.com&password=Password123!',
    })
    return res.status !== 500
  })

  // ============ 4. LOCKOUT ============
  console.log('\n===== 4. AUTH: LOCKOUT =====')
  let lockStatus = null
  for (let i = 0; i < 5; i++) {
    lockStatus = (await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'WrongPass1!' },
    })).status
  }
  await t('Account locks after 5 wrong attempts (423)', async () => lockStatus === 423)
  await t('Locked account rejects correct password (423)', async () => {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'Password123!' },
    })
    return r.status === 423
  })
  await t('Lockout clears after lockUntil passes', async () => {
    await User.updateOne({ email: 'usera@test.com' }, { $set: { lockUntil: new Date(Date.now() - 1000), loginAttempts: 0 } })
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'usera@test.com', password: 'Password123!' },
    })
    return r.status === 200
  })

  // ============ 5. TOKENS ============
  console.log('\n===== 5. AUTH: TOKENS =====')
  await t('No token -> 401', async () => {
    const r = await request('/api/tasks')
    return r.status === 401
  })
  await t('Garbage token -> 401', async () => {
    const r = await request('/api/tasks', { token: 'garbage.token.value' })
    return r.status === 401
  })
  await t('Tampered token -> 401', async () => {
    const r = await request('/api/tasks', { token: tokenA.slice(0, -3) + 'abc' })
    return r.status === 401
  })
  await t('Expired token -> 401', async () => {
    const expired = jwt.sign({ id: userA._id }, process.env.JWT_SECRET, { expiresIn: '-1s' })
    const r = await request('/api/tasks', { token: expired })
    return r.status === 401
  })
  await t('Wrong-secret token -> 401', async () => {
    const wrong = jwt.sign({ id: userA._id }, 'n'.repeat(64), { expiresIn: '1h' })
    const r = await request('/api/tasks', { token: wrong })
    return r.status === 401
  })
  await t('Logout revokes access + refresh tokens', async () => {
    const r = await request('/api/auth/logout', { method: 'POST', token: tokenA })
    if (r.status !== 200) return `status=${r.status}`
    const after = await request('/api/tasks', { token: tokenA })
    return after.status === 401
  })
  await t('Re-login works after logout', async () => {
    const r = await request('/api/auth/login', { method: 'POST', body: { email: 'usera@test.com', password: 'Password123!' } })
    if (r.status !== 200 || !r.data.token || !r.data.refreshToken) return `status=${r.status}`
    tokenA = r.data.token
    refreshTokenA = r.data.refreshToken
    return true
  })

  // ============ 6. TASKS ============
  console.log('\n===== 6. TASKS =====')
  let taskId
  await t('Create task -> 201', async () => {
    const r = await request('/api/tasks', {
      method: 'POST',
      token: tokenA,
      body: { title: 'Ship v2', description: 'Deploy', deadline: '2026-08-15T10:00:00.000Z', priority: 'high', tags: ['deploy', 'core'] },
    })
    if (r.status !== 201 || !r.data._id) return `status=${r.status} ${JSON.stringify(r.data)}`
    taskId = r.data._id
    return true
  })
  await t('Empty title rejected', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: '' } })
    return r.status >= 400
  })
  await t('Wrong priority type rejected', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: 'T', priority: 123 } })
    return r.status >= 400
  })
  await t('Invalid status enum rejected', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: 'T', status: 'bogus' } })
    return r.status >= 400
  })
  await t('Invalid deadline rejected (400, not 500)', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: 'T', deadline: 'not-a-date' } })
    return r.status === 400
  })
  await t('Missing title rejected', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { priority: 'high' } })
    return r.status >= 400
  })
  await t('Oversized body (>1MB) -> 413', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: 'Big', description: 'x'.repeat(1200000) } })
    return r.status === 413
  })
  await t('Mass assignment (_id / isAdmin) blocked by sanitize', async () => {
    const r = await request('/api/tasks', {
      method: 'POST',
      token: tokenA,
      body: { title: 'Forge', _id: '66c0a00000000000000000aa', isAdmin: true },
    })
    if (r.status !== 201) return `status=${r.status}`
    const saved = await Task.findOne({ title: 'Forge' })
    return saved._id.toString() !== '66c0a00000000000000000aa'
  })
  await t('List tasks -> array', async () => {
    const r = await request('/api/tasks', { token: tokenA })
    return r.status === 200 && Array.isArray(r.data)
  })
  await t('GET /api/tasks/:id returns the task', async () => {
    const r = await request(`/api/tasks/${taskId}`, { token: tokenA })
    return r.status === 200 && r.data._id === taskId
  })
  await t('Get task invalid ObjectId -> 400', async () => {
    const r = await request('/api/tasks/not-an-id', { token: tokenA })
    return r.status === 400
  })
  await t('Get task nonexistent -> 404', async () => {
    const r = await request('/api/tasks/66c0a00000000000000000bb', { token: tokenA })
    return r.status === 404
  })
  await t('Update task -> 200', async () => {
    const r = await request(`/api/tasks/${taskId}`, { method: 'PUT', token: tokenA, body: { title: 'Ship v2.1', status: 'in_progress' } })
    return r.status === 200 && r.data.title === 'Ship v2.1'
  })
  await t('Update invalid status -> 4xx', async () => {
    const r = await request(`/api/tasks/${taskId}`, { method: 'PUT', token: tokenA, body: { status: 'nope' } })
    return r.status >= 400
  })
  await t('Delete task -> 200 and removed from DB', async () => {
    const r = await request(`/api/tasks/${taskId}`, { method: 'DELETE', token: tokenA })
    const left = await Task.findById(taskId)
    return r.status === 200 && left === null
  })

  // ============ 7. AUTHORIZATION ============
  console.log('\n===== 7. AUTHORIZATION (cross-user) =====')
  await t('Signup user B', async () => {
    const r = await request('/api/auth/signup', {
      method: 'POST',
      body: { name: 'User B', email: 'userb@test.com', password: 'Password123!' },
    })
    if (r.status !== 201) return `status=${r.status}`
    userB = r.data.user
    tokenB = r.data.token
    return true
  })
  let taskA
  await t('Seed private task for user A', async () => {
    const r = await request('/api/tasks', { method: 'POST', token: tokenA, body: { title: 'A-private-task' } })
    if (r.status !== 201) return false
    taskA = r.data._id
    return true
  })
  await t('User B cannot read A task (404)', async () => {
    const r = await request(`/api/tasks/${taskA}`, { token: tokenB })
    return r.status === 404
  })
  await t('User B cannot update A task (404)', async () => {
    const r = await request(`/api/tasks/${taskA}`, { method: 'PUT', token: tokenB, body: { title: 'hijack' } })
    return r.status === 404
  })
  await t('User B cannot delete A task (404)', async () => {
    const r = await request(`/api/tasks/${taskA}`, { method: 'DELETE', token: tokenB })
    return r.status === 404
  })
  await t('User B task list empty (isolation)', async () => {
    const r = await request('/api/tasks', { token: tokenB })
    return r.status === 200 && r.data.length === 0
  })

  // ============ 8. GOALS ============
  console.log('\n===== 8. GOALS =====')
  let goalId
  await t('Create goal -> 201', async () => {
    const r = await request('/api/goals', { method: 'POST', token: tokenA, body: { title: 'Run 100km', progress: 20 } })
    if (r.status !== 201) return `status=${r.status} ${JSON.stringify(r.data)}`
    goalId = r.data._id
    return true
  })
  await t('Progress > 100 rejected', async () => {
    const r = await request('/api/goals', { method: 'POST', token: tokenA, body: { title: 'G', progress: 150 } })
    return r.status >= 400
  })
  await t('Negative progress rejected', async () => {
    const r = await request('/api/goals', { method: 'POST', token: tokenA, body: { title: 'G', progress: -5 } })
    return r.status >= 400
  })
  await t('Update goal progress -> 200', async () => {
    const r = await request(`/api/goals/${goalId}`, { method: 'PUT', token: tokenA, body: { progress: 55 } })
    return r.status === 200 && r.data.progress === 55
  })
  await t('Delete goal -> 200', async () => {
    const r = await request(`/api/goals/${goalId}`, { method: 'DELETE', token: tokenA })
    return r.status === 200
  })

  // ============ 9. HABITS ============
  console.log('\n===== 9. HABITS =====')
  let habitId
  await t('Create habit -> 201', async () => {
    const r = await request('/api/habits', { method: 'POST', token: tokenA, body: { title: 'Meditate', frequency: 'daily' } })
    if (r.status !== 201) return `status=${r.status} ${JSON.stringify(r.data)}`
    habitId = r.data._id
    return true
  })
  await t('Invalid frequency rejected', async () => {
    const r = await request('/api/habits', { method: 'POST', token: tokenA, body: { title: 'H', frequency: 'yearly' } })
    return r.status >= 400
  })
  await t('Check-in habit -> 200', async () => {
    const r = await request(`/api/habits/${habitId}/checkin`, { method: 'POST', token: tokenA })
    return r.status === 200
  })
  await t('Check-in dedupe same day (no double log)', async () => {
    await request(`/api/habits/${habitId}/checkin`, { method: 'POST', token: tokenA })
    const habit = await Habit.findById(habitId)
    return habit.logs.length === 1
  })
  await t('Check-in nonexistent habit -> 404', async () => {
    const r = await request('/api/habits/66c0a00000000000000000bb/checkin', { method: 'POST', token: tokenA })
    return r.status === 404
  })
  await t('Delete habit -> 200', async () => {
    const r = await request(`/api/habits/${habitId}`, { method: 'DELETE', token: tokenA })
    return r.status === 200
  })

  // ============ 10. NOTIFICATIONS ============
  console.log('\n===== 10. NOTIFICATIONS =====')
  let notifId
  await t('Seed notification directly', async () => {
    const n = await Notification.create({ user: userA._id, type: 'system', title: 'Welcome', message: 'Hi' })
    notifId = n._id
    return true
  })
  await t('List notifications -> array', async () => {
    const r = await request('/api/notifications', { token: tokenA })
    return r.status === 200 && Array.isArray(r.data)
  })
  await t('Mark notification read (PUT) -> 200', async () => {
    const r = await request(`/api/notifications/${notifId}/read`, { method: 'PUT', token: tokenA })
    return r.status === 200
  })
  await t('Mark all notifications read (PUT /read-all) -> 200 + count', async () => {
    await Notification.create({ user: userA._id, type: 'reminder', title: 'Reminder', message: 'Test' })
    const r = await request('/api/notifications/read-all', { method: 'PUT', token: tokenA })
    if (r.status !== 200) return `status=${r.status}`
    const unread = await Notification.countDocuments({ user: userA._id, status: 'unread' })
    return unread === 0
  })
  await t('DELETE /api/notifications/:id removes notification', async () => {
    const r = await request(`/api/notifications/${notifId}`, { method: 'DELETE', token: tokenA })
    if (r.status !== 200) return `status=${r.status}`
    const still = await Notification.findById(notifId)
    return still === null
  })
  await t('User B cannot see A notifications', async () => {
    const r = await request('/api/notifications', { token: tokenB })
    return r.status === 200 && r.data.length === 0
  })

  // ============ 11. PUSH ============
  console.log('\n===== 11. PUSH SUBSCRIPTIONS =====')
  await t('Subscribe -> 200', async () => {
    const r = await request('/api/push/subscribe', {
      method: 'POST',
      token: tokenA,
      body: { endpoint: 'https://fcm.googleapis.com/send/qa-endpoint-1', keys: { p256dh: 'AAA=', auth: 'BBB=' } },
    })
    return r.status === 200
  })
  await t('Subscribe missing keys rejected', async () => {
    const r = await request('/api/push/subscribe', { method: 'POST', token: tokenA, body: { endpoint: 'x' } })
    return r.status >= 400
  })
  await t('Subscription owned by correct user', async () => {
    const sub = await PushSubscription.findOne({ endpoint: 'https://fcm.googleapis.com/send/qa-endpoint-1' })
    return sub && String(sub.user) === String(userA._id)
  })
  await t('Unsubscribe -> 200', async () => {
    const r = await request('/api/push/unsubscribe', { method: 'POST', token: tokenA, body: { endpoint: 'https://fcm.googleapis.com/send/qa-endpoint-1' } })
    const left = await PushSubscription.countDocuments()
    return r.status === 200 && left === 0
  })

  // ============ 12. CHAT ============
  console.log('\n===== 12. CHAT =====')
  let msgId
  await t('Save chat message (role user) -> 201', async () => {
    const r = await request('/api/chat', { method: 'POST', token: tokenA, body: { sessionId: 'general', role: 'user', text: 'Hello' } })
    if (r.status !== 201) return `status=${r.status} ${JSON.stringify(r.data)}`
    msgId = r.data._id
    return true
  })
  await t('Save message invalid role rejected', async () => {
    const r = await request('/api/chat', { method: 'POST', token: tokenA, body: { sessionId: 'general', role: 'admin', text: 'x' } })
    return r.status >= 400
  })
  await t('Save message missing sessionId -> 400', async () => {
    const r = await request('/api/chat', { method: 'POST', token: tokenA, body: { role: 'user', text: 'x' } })
    return r.status === 400
  })
  await t('Chat history -> array', async () => {
    const r = await request('/api/chat?sessionId=general', { token: tokenA })
    return r.status === 200 && Array.isArray(r.data) && r.data.length >= 1
  })
  await t('Chat sessions aggregate -> array', async () => {
    const r = await request('/api/chat/sessions', { token: tokenA })
    return r.status === 200 && Array.isArray(r.data)
  })
  await t('Chat history isolated between users', async () => {
    const r = await request('/api/chat?sessionId=general', { token: tokenB })
    return r.status === 200 && r.data.length === 0
  })
  await t('Delete chat message -> 200', async () => {
    const r = await request(`/api/chat/${msgId}`, { method: 'DELETE', token: tokenA })
    return r.status === 200
  })
  await t('Clear chat history -> 200', async () => {
    const r = await request('/api/chat/clear?sessionId=general', { method: 'DELETE', token: tokenA })
    const left = await ChatMessage.countDocuments({ user: userA._id, sessionId: 'general' })
    return r.status === 200 && left === 0
  })
  await t('Session limit: 7 sessions -> oldest pruned', async () => {
    for (let i = 0; i < 8; i++) {
      await request('/api/chat', { method: 'POST', token: tokenA, body: { sessionId: `s${i}`, role: 'user', text: 'x' } })
    }
    const distinct = await ChatMessage.distinct('sessionId', { user: userA._id })
    return distinct.length <= 6
  })

  // ============ 13. SETTINGS ============
  console.log('\n===== 13. SETTINGS =====')
  await t('Get profile -> 200', async () => {
    const r = await request('/api/settings/profile', { token: tokenA })
    return r.status === 200
  })
  await t('Get profile does NOT leak password hash', async () => {
    const r = await request('/api/settings/profile', { token: tokenA })
    return !r.data?.password
  })
  await t('Update profile name -> 200', async () => {
    const r = await request('/api/settings/profile', { method: 'PUT', token: tokenA, body: { name: 'User A Renamed' } })
    return r.status === 200 && r.data.name === 'User A Renamed'
  })
  await t('Change password wrong old -> 400', async () => {
    const r = await request('/api/settings/password', { method: 'PUT', token: tokenA, body: { currentPassword: 'wrong', newPassword: 'NewPassword1!' } })
    return r.status >= 400
  })
  await t('Change password weak new value rejected cleanly (4xx)', async () => {
    const r = await request('/api/settings/password', { method: 'PUT', token: tokenA, body: { currentPassword: 'Password123!', newPassword: '123' } })
    if (r.status === 500) return `500 (validator error leaked; should be 400)`
    return r.status >= 400
  })
  await t('Change password correct old -> 200; old password invalidated', async () => {
    const r = await request('/api/settings/password', { method: 'PUT', token: tokenA, body: { currentPassword: 'Password123!', newPassword: 'NewPassword1!' } })
    if (r.status !== 200) return `status=${r.status}`
    const relog = await request('/api/auth/login', { method: 'POST', body: { email: 'usera@test.com', password: 'Password123!' } })
    return relog.status === 401
  })
  await t('Old access token revoked after password change', async () => {
    const r = await request('/api/settings/profile', { token: tokenA })
    return r.status === 401
  })
  await t('Login again after password change (new credentials)', async () => {
    const r = await request('/api/auth/login', { method: 'POST', body: { email: 'usera@test.com', password: 'NewPassword1!' } })
    if (r.status !== 200 || !r.data.token || !r.data.refreshToken) return `status=${r.status}`
    tokenA = r.data.token
    return true
  })
  await t('Refresh token issues new access token', async () => {
    const r = await request('/api/auth/login', { method: 'POST', body: { email: 'usera@test.com', password: 'NewPassword1!' } })
    const refresh = await request('/api/auth/refresh', { method: 'POST', body: { refreshToken: r.data.refreshToken } })
    if (refresh.status !== 200 || !refresh.data.token) return `status=${refresh.status}`
    const use = await request('/api/settings/profile', { token: refresh.data.token })
    return use.status === 200
  })
  await t('Refresh with garbage token -> 401', async () => {
    const r = await request('/api/auth/refresh', { method: 'POST', body: { refreshToken: 'garbage' } })
    return r.status === 401
  })
  await t('Refresh token cannot be used as access token -> 401', async () => {
    const r = await request('/api/auth/login', { method: 'POST', body: { email: 'usera@test.com', password: 'NewPassword1!' } })
    const use = await request('/api/settings/profile', { token: r.data.refreshToken })
    return use.status === 401
  })
  await t('AI settings default -> 200', async () => {
    const r = await request('/api/settings/ai', { token: tokenA })
    return r.status === 200 && r.data.aggressiveness === 'medium' && r.data.autoScheduling === true
  })
  await t('AI settings update persists', async () => {
    const r = await request('/api/settings/ai', { method: 'PUT', token: tokenA, body: { aggressiveness: 'high', autoScheduling: false } })
    if (r.status !== 200) return `status=${r.status}`
    const g = await request('/api/settings/ai', { token: tokenA })
    return g.data.aggressiveness === 'high' && g.data.autoScheduling === false
  })
  await t('AI settings invalid aggressiveness -> 400', async () => {
    const r = await request('/api/settings/ai', { method: 'PUT', token: tokenA, body: { aggressiveness: 'insane' } })
    return r.status === 400
  })

  // ============ 14. ACCOUNT DELETE CASCADE ============
  console.log('\n===== 14. ACCOUNT DELETE CASCADE =====')
  let delId, delToken
  await t('Seed user C with full data', async () => {
    const r = await request('/api/auth/signup', { method: 'POST', body: { name: 'User C', email: 'userc@test.com', password: 'Password123!' } })
    delToken = r.data.token
    delId = r.data.user._id
    await Task.create({ user: delId, title: 'c-task', deadline: new Date() })
    await Goal.create({ user: delId, title: 'c-goal' })
    await Habit.create({ user: delId, title: 'c-habit', frequency: 'daily' })
    await Notification.create({ user: delId, type: 'system', title: 'c-notif', message: 'x' })
    await ChatMessage.create({ user: delId, sessionId: 's', role: 'user', text: 'x' })
    await AiUsage.create({ user: delId, date: new Date(), count: 1 })
    await PushSubscription.create({ user: delId, endpoint: 'https://fcm/send/c', keys: { p256dh: 'x', auth: 'y' } })
    return true
  })
  await t('Delete account without password -> 400', async () => {
    const r = await request('/api/settings/account', { method: 'DELETE', token: delToken, body: {} })
    return r.status === 400
  })
  await t('Delete account with wrong password -> 400', async () => {
    const r = await request('/api/settings/account', { method: 'DELETE', token: delToken, body: { password: 'wrongpass1' } })
    return r.status === 400
  })
  await t('Delete account -> 200', async () => {
    const r = await request('/api/settings/account', { method: 'DELETE', token: delToken, body: { password: 'Password123!' } })
    return r.status === 200
  })
  await t('User/tasks/goals/habits/notifications cascade-deleted', async () => {
    const [u, ts, g, h, n] = await Promise.all([
      User.findById(delId), Task.countDocuments({ user: delId }), Goal.countDocuments({ user: delId }),
      Habit.countDocuments({ user: delId }), Notification.countDocuments({ user: delId }),
    ])
    return u === null && ts === 0 && g === 0 && h === 0 && n === 0
  })
  await t('Chat/Push/AiUsage cascade-deleted after account delete', async () => {
    const [c, p, a] = await Promise.all([
      ChatMessage.countDocuments({ user: delId }), PushSubscription.countDocuments({ user: delId }),
      AiUsage.countDocuments({ user: delId }),
    ])
    return c === 0 && p === 0 && a === 0
  })
  await t('Deleted account token rejected -> 401', async () => {
    const r = await request('/api/tasks', { token: delToken })
    return r.status === 401
  })

  // ============ 15. ANALYTICS ============
  console.log('\n===== 15. ANALYTICS =====')
  await t('Weekly analytics -> 200', async () => {
    const r = await request('/api/analytics/weekly', { token: tokenB })
    return r.status === 200
  })
  await t('Monthly analytics -> 200', async () => {
    const r = await request('/api/analytics/monthly', { token: tokenB })
    return r.status === 200
  })
  await t('Stats -> 200 with object', async () => {
    const r = await request('/api/analytics/stats', { token: tokenB })
    return r.status === 200 && typeof r.data === 'object'
  })

  // ============ 16. AI ENDPOINTS ============
  console.log('\n===== 16. AI ENDPOINTS (no API key) =====')
  await t('AI usage -> 200', async () => {
    const r = await request('/api/ai/usage', { token: tokenA })
    return r.status === 200
  })
  await t('AI plan without prompt -> 400', async () => {
    const r = await request('/api/ai/plan', { method: 'POST', token: tokenA, body: {} })
    return r.status === 400
  })
  await t('AI plan without key -> graceful 5xx (no crash)', async () => {
    const r = await request('/api/ai/plan', { method: 'POST', token: tokenA, body: { prompt: 'plan my week' } })
    return r.status >= 500
  })
  await t('AI endpoints require auth', async () => {
    const r = await request('/api/ai/plan', { method: 'POST', body: { prompt: 'x' } })
    return r.status === 401
  })

  // ============ 17. REMINDER SWEEP ============
  console.log('\n===== 17. REMINDER SERVICE (lazy sweep) =====')
  const { runReminderCheckIfDue } = require('../services/reminderService')
  const ReminderState = require('../models/ReminderState')
  await t('Sweep creates deadline notification', async () => {
    await ReminderState.updateOne({ key: 'reminderSweep' }, { $set: { lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000) } }, { upsert: true })
    await Task.create({ user: userB._id, title: 'due-soon', deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) })
    const ran = await runReminderCheckIfDue()
    const notif = await Notification.findOne({ title: { $regex: 'due-soon' } })
    return ran === true && notif !== null
  })
  await t('Sweep never duplicates a notification (dedup)', async () => {
    await runReminderCheckIfDue()
    const dups = await Notification.countDocuments({ title: { $regex: 'due-soon' } })
    return dups === 1
  })

  // ============ 18. DATABASE ============
  console.log('\n===== 18. DATABASE INTEGRITY =====')
  await t('Task has compound indexes (user+createdAt)', async () => {
    const idx = await Task.collection.indexes()
    return idx.some((i) => Object.keys(i.key).join(',').includes('user,createdAt'))
  })
  await t('Email unique index enforced at DB level', async () => {
    const dup = await User.create({ name: 'dupe', email: 'usera@test.com', password: 'Password123!' }).catch((e) => e)
    return dup && dup.name === 'MongoServerError'
  })
  await t('Task without deadline stores null (no crash)', async () => {
    const task = await Task.create({ user: userB._id, title: 'no-deadline' })
    return task.deadline === null
  })

  // ============ 19. PERFORMANCE SNAPSHOT ============
  console.log('\n===== 19. PERFORMANCE SNAPSHOT =====')
  await t('Bulk 200 tasks then list latency < 500ms', async () => {
    const ops = []
    for (let i = 0; i < 200; i++) ops.push(Task.create({ user: userA._id, title: `bulk-${i}`, deadline: new Date(Date.now() + i * 60000) }))
    await Promise.all(ops)
    const start = Date.now()
    const r = await request('/api/tasks', { token: tokenA })
    const ms = Date.now() - start
    if (!(r.status === 200 && r.data.length === 202)) return `status=${r.status} len=${r.data && r.data.length}`
    return ms < 500 ? true : `list of 201 tasks took ${ms}ms`
  })
  await t('Task list has no pagination (limitation noted)', async () => {
    const r = await request('/api/tasks', { token: tokenA })
    return !(r.data.page || r.data.total || r.data.hasNext)
  })
  await t('Pagination: ?limit=10&page=2 returns 10 + X-Total-Count', async () => {
    const r = await request('/api/tasks?limit=10&page=2', { token: tokenA })
    const total = Number(r.headers.get('x-total-count'))
    return r.status === 200 && r.data.length === 10 && total === 202
  })

  // ============ 20. RATE LIMITING (fresh app, low login limit) ============
  console.log('\n===== 20. RATE LIMITING =====')
  await t('Login limiter 429 after 5/min (fresh app)', async () => {
    await server.close()
    for (const m of Object.keys(require.cache)) if (m.includes('flowsync-backend')) delete require.cache[m]
    process.env.RATE_LIMIT_LOGIN = '5'
    const fresh = await bootServer()
    const b = fresh.url
    let last = null
    for (let i = 0; i < 6; i++) {
      const res = await fetch(b + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ratelimit@test.com', password: 'XPass1234!' }),
      })
      last = res.status
    }
    await fresh.srv.close()
    return last === 429
  })

  // ============ SUMMARY ============
  const passed = results.filter((r) => r.ok).length
  const failed = results.length - passed
  console.log('\n==========================================')
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED, ${results.length} TOTAL`)
  console.log('==========================================')
  if (errors.length) {
    console.log('\nFAILED TESTS:')
    errors.forEach((e) => console.log('  ' + e))
  }

  await mongoose.disconnect()
  await mongo.stop()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('HARNESS FATAL:', e)
  process.exit(2)
})
