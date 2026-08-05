import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const email = `qa-full-${randomUUID()}@test.com`
const password = 'Password123!'
const browser = await chromium.launch({ headless: true })

const signup = await (await fetch(BASE + '/api/auth/signup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'QA Full', email, password }),
})).json()
const token = signup.token
const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

const longURL = 'https://example.com/a/really/very/long/path/segment/that/never/breaks/anywhere/at/all/9876543210/abcdefghijklmnopqrstuvwxyz'
const longHindi = 'हिंदी में एक बहुत लंबा उत्तर लिखा गया है जिसे हम मोबाइल स्क्रीन पर टेस्ट कर रहे हैं ताकि टेक्स्ट सही तरीके से wrap हो और कोई भी हिस्सा कटे नहीं।'
const code = 'const fn = (a,b,c,d,e,f,g) => { return a+b+c+d+e+f+g } // long code line test'
const p = (path, body) => fetch(BASE + path, { method: 'POST', headers: H, body: JSON.stringify(body) })

// ---- seed data ----
for (let i = 1; i <= 6; i++) {
  await p('/api/tasks', { title: `Audit task ${i} ${'with a quite long title to test wrapping in list rows and cards '.repeat(2)}`, priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low', status: i % 4 === 0 ? 'completed' : 'pending', deadline: `2026-08-${String(10 + i).padStart(2, '0')}`, description: `Description ${i}` })
}
await p('/api/goals', { title: 'Audit Goal', targetDate: '2026-12-31', progress: 40 })
await p('/api/habits', { title: 'Audit Habit', frequency: 'daily' })
await p('/api/notifications', { type: 'system', title: 'Audit Notification', message: 'A seeded notification for the drawer test' })
for (let i = 1; i <= 3; i++) {
  await p('/api/chat', { sessionId: 'audit-main', role: i === 1 ? 'user' : 'ai', text: i === 1 ? `Plan my day — report due, ${longURL} to check, and this Hindi line: ${longHindi}` : `${code} Also a table: alpha beta gamma delta epsilon zeta eta theta — long single line to test wrapping.`, tasks: i === 2 ? [{ title: 'Report submission', priority: 'high', deadline: '2026-08-07' }, { title: 'Team sync call', priority: 'medium', deadline: null }] : [], suggestions: [] })
}
await p('/api/notifications', { type: 'deadline', title: 'Task Due Today', message: 'Audit task 2 is due today!' })

// ---- audit ----
const VIEWPORTS = [
  { w: 320, mobile: true }, { w: 360, mobile: true }, { w: 375, mobile: true },
  { w: 412, mobile: true }, { w: 430, mobile: true }, { w: 600, mobile: true },
  { w: 768, mobile: false }, { w: 820, mobile: false }, { w: 1024, mobile: false },
  { w: 1280, mobile: false }, { w: 1366, mobile: false }, { w: 1440, mobile: false },
  { w: 1600, mobile: false }, { w: 1920, mobile: false }, { w: 2560, mobile: false },
]
const PUBLIC = ['/', '/login', '/register', '/non-existent-route']
const AUTHED = ['/dashboard', '/tasks', '/calendar', '/focus', '/habits', '/analytics', '/notifications', '/profile', '/settings', '/ai-planner']

const results = {} // page -> { width -> metrics }
const consoleIssues = []
const failedRequests = []

const AUDIT_JS = () => {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const body = document.body
  const out = {
    vw, vh,
    bodyScrollW: body.scrollWidth, bodyClientW: body.clientWidth,
    docScrollW: document.documentElement.scrollWidth,
    headerOverflow: null,
    maxRight: null, bleedCount: 0, bleedEls: [],
    smallTargets: [], smallTargetCount: 0,
    inputs: 0,
  }
  const header = document.querySelector('header')
  if (header) out.headerOverflow = { scrollW: header.scrollWidth, clientW: header.clientWidth }

  let maxRight = 0, maxRightEl = ''
  for (const el of document.querySelectorAll('*')) {
    const b = el.getBoundingClientRect()
    if (b.width === 0 || b.height === 0) continue
    if (b.left < -50) continue
    if (b.right > maxRight) { maxRight = b.right; maxRightEl = el.tagName + '.' + String(el.className?.toString?.().slice(0, 30) || '') }
    if (b.right > vw + 1) {
      out.bleedCount++
      if (out.bleedEls.length < 5) out.bleedEls.push(el.tagName + '.' + String(el.className?.toString?.().slice(0, 40) || '') + ' right=' + Math.round(b.right))
    }
  }
  out.maxRight = { right: Math.round(maxRight), el: maxRightEl }

  for (const el of document.querySelectorAll('button, a, input, select, [role="button"]')) {
    const b = el.getBoundingClientRect()
    if (b.width === 0 || b.height === 0) continue
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') continue
    if (b.width < 36 || b.height < 36) {
      out.smallTargetCount++
      if (out.smallTargets.length < 6) out.smallTargets.push(el.tagName + '.' + String(el.className?.toString?.().slice(0, 35) || '') + ` ${Math.round(b.width)}x${Math.round(b.height)}`)
    }
  }
  out.inputs = document.querySelectorAll('input, textarea, select').length
  return out
}

const measure = async (page, path, vp) => {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: 800 }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  const errs = [], fails = []
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)) })
  p.on('pageerror', e => errs.push('PAGEERROR: ' + String(e.message).slice(0, 160)))
  p.on('requestfailed', r => fails.push((r.url() || '').slice(0, 120)))
  if (path !== '/' && path !== '/login' && path !== '/register' && path !== '/non-existent-route') {
    await p.addInitScript(({ token, user }) => {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', 'x')
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('flowsync_onboard_shown_v1', '1')
    }, { token, user: signup.user })
  }
  const t0 = Date.now()
  let navErr = null
  try {
    await p.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 40000 })
    await p.waitForTimeout(path.includes('dashboard') || path === '/ai-planner' ? 2200 : 1300)
  } catch (e) { navErr = String(e.message).slice(0, 140) }
  const m = await p.evaluate(AUDIT_JS).catch(e => ({ evalErr: String(e.message) }))
  const loadMs = Date.now() - t0
  await p.screenshot({ path: `C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-screens/${path.replace(/\//g, '_')}_${vp.w}.png` }).catch(() => {})
  await ctx.close()
  return { m, errs, fails, navErr, loadMs }
}

const LOG = []
const sweep = async (paths, label) => {
  for (const path of paths) {
    results[path] = results[path] || {}
    for (const vp of VIEWPORTS) {
      const r = await measure(null, path, vp)
      results[path][vp.w] = r.m
      if (r.m.headerOverflow && r.m.headerOverflow.scrollW > r.m.headerOverflow.clientW + 1) {
        LOG.push(`[HEADER] ${label} ${path} @${vp.w}: scrollW=${r.m.headerOverflow.scrollW} clientW=${r.m.headerOverflow.clientW}`)
      }
      if (r.m.bodyScrollW > r.m.bodyClientW + 1 || r.m.docScrollW > r.m.vw + 1) {
        LOG.push(`[H-SCROLL] ${label} ${path} @${vp.w}: body=${r.m.bodyScrollW}/${r.m.bodyClientW} doc=${r.m.docScrollW}/${r.m.vw}`)
      }
      if (r.m.bleedCount > 0) {
        LOG.push(`[BLEED ${r.m.bleedCount}] ${label} ${path} @${vp.w}: ${r.m.bleedEls.join(' | ')}`)
      }
      if (r.errs.length) consoleIssues.push({ path, w: vp.w, errs: [...new Set(r.errs)].slice(0, 4) })
      if (r.fails.length) failedRequests.push({ path, w: vp.w, urls: [...new Set(r.fails)].slice(0, 3) })
      if (r.navErr) LOG.push(`[NAV-ERR] ${label} ${path} @${vp.w}: ${r.navErr}`)
    }
  }
}

await sweep(PUBLIC, 'public')
await sweep(AUTHED, 'authed')

await browser.close()

// ---- summary ----
console.log('\n========== FULL AUDIT SUMMARY ==========')
console.log('\n--- ISSUES ---')
if (!LOG.length) console.log('  (no overflow/bleed/header/nav issues found)')
LOG.forEach(l => console.log('  ' + l))

console.log('\n--- CONSOLE ERRORS (unique per page+width) ---')
if (!consoleIssues.length) console.log('  (none)')
consoleIssues.forEach(c => console.log(`  ${c.path} @${c.w}: ${JSON.stringify(c.errs)}`))

console.log('\n--- FAILED REQUESTS ---')
if (!failedRequests.length) console.log('  (none)')
failedRequests.forEach(f => console.log(`  ${f.path} @${f.w}: ${JSON.stringify(f.urls)}`))

console.log('\n--- PER PAGE max horizontal overflow (body) across widths ---')
for (const [path, widths] of Object.entries(results)) {
  const worst = Object.entries(widths).reduce((a, [w, m]) => {
    const over = Math.max(0, m.docScrollW - m.vw)
    return over > a.over ? { over, w, extra: m.bodyScrollW - m.bodyClientW } : a
  }, { over: 0, w: 0 })
  console.log(`  ${path}: max over ${worst.over}px @${worst.w}px`)
}
console.log('\ndone')
