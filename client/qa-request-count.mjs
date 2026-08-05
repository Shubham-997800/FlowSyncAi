import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const email = `qa-count-${randomUUID()}@test.com`
const password = 'Password123!'
const browser = await chromium.launch({ headless: true })

const res = await fetch(BASE + '/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Count Tester', email, password }),
})
const signup = await res.json()

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.addInitScript(({ token, user }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', 'x')
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('flowsync_onboard_shown_v1', '1')
}, { token: signup.token, user: signup.user })

const apiCalls = []
page.on('request', r => { if (r.url().includes('/api/')) apiCalls.push(`${r.method()} ${new URL(r.url()).pathname}`) })

await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)

const counts = apiCalls.reduce((a, p) => { a[p] = (a[p] || 0) + 1; return a }, {})
console.log('TOTAL /api calls on one dashboard load:', apiCalls.length)
for (const [k, v] of Object.entries(counts).sort((x, y) => y[1] - x[1])) console.log(`  ${v}x  ${k}`)

await ctx.close()
await browser.close()
