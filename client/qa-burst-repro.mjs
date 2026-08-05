import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const SHOT = 'C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-screens'

const email = `qa-burst-${randomUUID()}@test.com`
const password = 'Password123!'
const browser = await chromium.launch({ headless: true })

async function apiFetch(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  return { status: res.status, body: await res.json().catch(() => null) }
}

// create user via API
let signup = await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Burst Tester', email, password }) })
const token = signup.body.token

// seed 15 tasks
for (let i = 1; i <= 15; i++) {
  await apiFetch('/api/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: `Burst task ${i}`, priority: i % 2 ? 'high' : 'medium', deadline: new Date(Date.now() + 86400000 * (i % 5)).toISOString().slice(0, 10) }),
  })
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.addInitScript(({ token, user }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', 'x')
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('flowsync_onboard_shown_v1', '1')
}, { token, user: signup.body.user })

let totalErrors = 0
const errorLog = []
page.on('pageerror', e => { totalErrors++; errorLog.push(`pageerror: ${e.message}`) })
page.on('console', m => { if (m.type() === 'error') { totalErrors++; errorLog.push(`console: ${m.text().slice(0, 180)}`) } })

let sawToast = false
let sawBoundary = false

// burst: 24 rapid reloads
for (let i = 1; i <= 24; i++) {
  const before = totalErrors
  await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const bodyText = await page.locator('body').innerText().catch(() => '')
  if (/Something went wrong/.test(bodyText)) {
    sawBoundary = true
    await page.screenshot({ path: `${SHOT}/burst_error_boundary_${i}.png` })
    console.log(`>>> reload ${i}: ERROR BOUNDARY shown`)
  }
  if (/Failed to load tasks/.test(bodyText)) {
    sawToast = true
    console.log(`>>> reload ${i}: 'Failed to load tasks' toast visible`)
  }
  if (totalErrors > before) {
    console.log(`--- reload ${i}: ${totalErrors - before} new errors`)
    for (const e of errorLog.slice(-(totalErrors - before))) console.log('    ', e)
  }
  if (sawBoundary) break
}

console.log('sawBoundary=', sawBoundary, 'sawToast=', sawToast, 'totalErrors=', totalErrors)
for (const e of errorLog.slice(0, 12)) console.log('  ', e)
await ctx.close()
await browser.close()
