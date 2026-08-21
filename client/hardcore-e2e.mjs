// Hardcore realtime E2E against PRODUCTION — login + every module + backend/DB checks.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = 'https://flowsyncai30.vercel.app'
const SHOTS = 'C:/Users/SHUBH/AppData/Local/Temp/opencode/shots'
mkdirSync(SHOTS, { recursive: true })
const ts = Date.now()
const EMAIL = `e2e_${ts}@flowsync.dev`
const PASS = 'Testpass1'

const results = []
const consoleErrors = []
const apiFailures = []
const shot = async (page, name) => { try { await page.screenshot({ path: `${SHOTS}/${name}.png` }) } catch {} }
const ok = (name, pass, extra = '') => { results.push({ name, pass, extra }); console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`) }
const dumpStorage = async (p, label) => {
  const s = await p.evaluate(() => ({ token: localStorage.getItem('token'), user: !!localStorage.getItem('user'), url: location.pathname }))
  console.log(`[storage:${label}]`, JSON.stringify(s))
}
const toastText = async (p) => p.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role="status"], [role="alert"]')].map(t => t.textContent.trim()).filter(Boolean).join(' || ').slice(0, 200))

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } })
const page = await ctx.newPage()
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)) })
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('/api/auth/login')) apiFailures.push(`${r.status()} ${r.url().replace(BASE, '')}`) })

try {
  // ---------- 0. BACKEND HEALTH + DB ----------
  const health = await (await fetch(`${BASE}/api/health`)).json()
  ok('Backend health', health.status === 'ok' && health.database === 'connected', JSON.stringify(health))

  // ---------- 1. LANDING ----------
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  ok('Landing loads', (await page.title()).length > 0, await page.title())
  await shot(page, '01-landing')

  // ---------- 2. SIGNUP ----------
  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' })
  await page.fill('#name', 'E2E Tester')
  await page.fill('#email', EMAIL)
  await page.fill('#password', PASS)
  await page.fill('#confirmPassword', PASS)
  const cb = page.locator('input[type="checkbox"]').first()
  if (!(await cb.isChecked())) {
    try { await cb.check({ timeout: 3000 }) } catch { await page.evaluate(() => document.querySelector('input[type="checkbox"]')?.click()) }
  }
  console.log(`[signup] checkbox checked=${await cb.isChecked().catch(() => '?')}`)
  await shot(page, '02-signup-filled')
  const regResp = page.waitForResponse(r => r.url().includes('/api/auth/signup'), { timeout: 20000 }).catch(() => null)
  await page.click('button[type="submit"]')
  const reg = await regResp
  let regBody = null
  try { regBody = reg ? await reg.json() : null } catch { regBody = '<non-json>' }
  console.log(`[signup] register status=${reg?.status()} body=${JSON.stringify(regBody).slice(0, 160)}`)
  ok('Register API called + 201', reg?.status() === 201, `status=${reg?.status()}`)
  await page.waitForURL(u => u.pathname === '/dashboard', { timeout: 15000 }).catch(() => {})
  ok('Signup -> /dashboard', new URL(page.url()).pathname === '/dashboard', page.url())
  await dumpStorage(page, 'after-signup')
  const t1 = await toastText(page)
  if (t1) console.log(`[signup] toast="${t1}"`)
  await page.waitForTimeout(2500)
  await shot(page, '03-dashboard')

  // ---------- 2b. DEVICE ONBOARDING MODAL ----------
  const onboardBtn = page.locator('button:has-text("Got it, let\'s go")').locator('visible=true').first()
  if (await onboardBtn.count()) {
    ok('Device onboarding modal shown', true)
    await onboardBtn.click({ timeout: 5000 })
    await page.waitForTimeout(600)
    const gone = await page.locator('div[role="dialog"]').count() === 0
    ok('Onboarding dismisses cleanly', gone)
  } else ok('Device onboarding modal shown', false, 'not found')

  // ---------- 3. SESSION RESTORE ON REFRESH ----------
  await page.reload({ waitUntil: 'networkidle' })
  const stillIn = new URL(page.url()).pathname !== '/login'
  ok('Session restore on refresh', stillIn, page.url())

  // ---------- 4. TASKS CRUD ----------
  await page.goto(`${BASE}/tasks`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const addBtn = page.locator('button:has-text("Add Task")').locator('visible=true').first()
  if (await addBtn.count()) {
    await addBtn.click({ timeout: 10000 })
    await page.waitForSelector('input[placeholder="Enter task title"]', { timeout: 5000 })
    await page.fill('input[placeholder="Enter task title"]', `E2E Task ${ts}`)
    await page.locator('button:has-text("Create Task")').first().click()
  }
  let taskVisible = false
  try {
    await page.waitForSelector(`text=E2E Task ${ts}`, { timeout: 10000 })
    taskVisible = true
  } catch {}
  ok('Task create (UI)', taskVisible)

  // API-level CRUD verification (backend+DB truth)
  let token = await page.evaluate(() => localStorage.getItem('token'))
  if (!token) {
    console.log('[recover] no token in localStorage — attempting direct API login')
    const lr = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASS }) })
    const lj = await lr.json().catch(() => ({}))
    console.log(`[recover] login status=${lr.status} hasToken=${!!lj.token}`)
    ok('Account exists in DB (login works)', lr.status === 200 && !!lj.token, `status=${lr.status}`)
    token = lj.token || null
    if (token) await page.evaluate(t => { localStorage.setItem('token', t); localStorage.setItem('user', '{"name":"E2E Tester"}') }, token)
  }
  const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const mk = await (await fetch(`${BASE}/api/tasks`, { method: 'POST', headers: H, body: JSON.stringify({ title: `API Task ${ts}`, priority: 'high', deadline: new Date(Date.now() + 864e5).toISOString() }) })).json()
  ok('Task create (API->DB)', !!mk._id, mk._id || JSON.stringify(mk).slice(0, 80))
  const lst = await (await fetch(`${BASE}/api/tasks?limit=5&search=${encodeURIComponent(`API Task ${ts}`)}`, { headers: H })).json()
  ok('Task search finds it', Array.isArray(lst) && lst.some(t => t._id === mk._id), `total=${lst.length ?? '?'}`)
  const upd = await (await fetch(`${BASE}/api/tasks/${mk._id}`, { method: 'PUT', headers: H, body: JSON.stringify({ status: 'done' }) })).json()
  ok('Task update -> done', upd.status === 'done')
  const del = await fetch(`${BASE}/api/tasks/${mk._id}`, { method: 'DELETE', headers: H })
  ok('Task delete', del.status === 200)
  await shot(page, '04-tasks')

  // ---------- 5. GOALS ----------
  const goal = await (await fetch(`${BASE}/api/goals`, { method: 'POST', headers: H, body: JSON.stringify({ title: `Goal ${ts}`, targetDate: new Date(Date.now() + 7 * 864e5).toISOString() }) })).json()
  ok('Goal create', !!goal._id)
  const gUpd = await (await fetch(`${BASE}/api/goals/${goal._id}`, { method: 'PUT', headers: H, body: JSON.stringify({ progress: 50 }) })).json()
  ok('Goal progress 50%', gUpd.progress === 50)
  await page.goto(`${BASE}/goals`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(1200)
  await shot(page, '05-goals')

  // ---------- 6. HABITS + STREAK ----------
  const habit = await (await fetch(`${BASE}/api/habits`, { method: 'POST', headers: H, body: JSON.stringify({ title: `Habit ${ts}` }) })).json()
  ok('Habit create', !!habit._id)
  const checkin = await (await fetch(`${BASE}/api/habits/${habit._id}/checkin`, { method: 'POST', headers: H })).json()
  ok('Habit check-in streak=1', checkin.streak === 1, `streak=${checkin.streak}`)
  const dup = await (await fetch(`${BASE}/api/habits/${habit._id}/checkin`, { method: 'POST', headers: H })).json()
  ok('Same-day checkin dedupe', (dup.logs || []).filter(l => l === (dup.logs || [])[0]).length === 1)

  // ---------- 7. ANALYTICS (aggregation path) ----------
  const stats = await (await fetch(`${BASE}/api/analytics/stats`, { headers: H })).json()
  ok('Analytics stats (agg)', typeof stats.total === 'number' && stats.total >= 1, JSON.stringify(stats).slice(0, 100))
  const weekly = await (await fetch(`${BASE}/api/analytics/weekly`, { headers: H })).json()
  ok('Analytics weekly', Array.isArray(weekly.dailyBreakdown) && weekly.dailyBreakdown.length === 7)

  // ---------- 8. AI CHAT (real provider call) ----------
  await page.goto(`${BASE}/ai-planner`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(1500)
  await shot(page, '06-ai-planner')
  const aiRes = await fetch(`${BASE}/api/ai/chat`, { method: 'POST', headers: H, body: JSON.stringify({ message: 'Add a task called Buy milk tomorrow at 9am', sessionId: `e2e-${ts}` }) })
  const aiJson = await aiRes.json()
  ok('AI chat responds', aiRes.status === 200 && (aiJson.reply || '').length > 0, aiRes.status === 200 ? `reply=${(aiJson.reply || '').slice(0, 60)}` : JSON.stringify(aiJson).slice(0, 80))
  ok('AI structured tasks valid', aiJson.tasks === undefined || Array.isArray(aiJson.tasks))
  const usage = await (await fetch(`${BASE}/api/ai/usage`, { headers: H })).json()
  ok('AI quota recorded in DB', usage.used >= 1, JSON.stringify(usage))

  // ---------- 9. NOTIFICATIONS ----------
  const notifs = await (await fetch(`${BASE}/api/notifications`, { headers: H })).json()
  ok('Notifications endpoint', Array.isArray(notifs))

  // ---------- 10. SETTINGS: ABOUT VERSION + ACTIVE DEVICES (UI) ----------
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const aboutTab = page.locator('button:has-text("About")').first()
  if (await aboutTab.count()) {
    await aboutTab.click()
    await page.waitForTimeout(1200)
    const ver = await page.locator('text=/v\\d+\\.\\d+\\.\\d+/').first().textContent().catch(() => null)
    ok('About tab shows version', !!ver, ver || '')
    const chk = page.locator('button:has-text("Check for Updates")').first()
    if (await chk.count()) {
      await chk.click()
      let outcome = ''
      for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(500)
        if (await page.locator('text=latest version').count()) { outcome = 'latest'; break }
        if (await page.locator('text=Update available').count()) { outcome = 'update-available'; break }
      }
      ok('Check-for-Updates works', outcome === 'latest' || outcome === 'update-available', `outcome=${outcome || 'timeout'}`)
    }
  } else ok('About tab present', false, 'not found')
  await shot(page, '07-about')

  const accountTab = page.locator('button:has-text("Account")').first()
  if (await accountTab.count()) {
    await accountTab.click()
    await page.waitForTimeout(1500)
    const devices = await page.locator('text=Active Devices').count() > 0
    const thisDevice = await page.locator('text=This device').count() > 0
    ok('Active Devices section renders', devices)
    ok('Current device flagged', thisDevice)
  }
  await shot(page, '08-account-devices')

  // Sessions API truth
  const sess = await (await fetch(`${BASE}/api/auth/sessions`, { headers: H })).json()
  ok('Sessions API lists device', Array.isArray(sess) && sess.length >= 1 && sess[0].device, sess[0]?.device || '')

  // ---------- 11. THEME SWITCH ----------
  const themeTab = page.locator('button:has-text("Theme")').first()
  if (await themeTab.count()) {
    await themeTab.click(); await page.waitForTimeout(800)
    const darkBtn = page.locator('button:has-text("Dark")').first()
    if (await darkBtn.count()) { await darkBtn.click(); await page.waitForTimeout(500) }
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    ok('Theme switch persists class', isDark)
    const stored = await page.evaluate(() => localStorage.getItem('theme-mode'))
    ok('Theme pref saved (data preserved)', stored === 'dark', `stored=${stored}`)
  }
  await shot(page, '09-theme')

  // ---------- 12. LOGOUT -> LOGIN AGAIN ----------
  await page.evaluate(() => { localStorage.removeItem('theme-mode') })
  const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout")').first()
  if (await logoutBtn.count()) {
    await logoutBtn.click()
    await page.waitForTimeout(2500)
  }
  // After logout the session row is gone -> old token must be dead (per-device revocation)
  const afterLogout = await fetch(`${BASE}/api/tasks`, { headers: H })
  ok('Per-device revocation kills old token', afterLogout.status === 401, `status=${afterLogout.status}`)
  // Login again
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('#email', EMAIL)
  await page.fill('#password', PASS)
  const loginResp = page.waitForResponse(r => r.url().includes('/api/auth/login'), { timeout: 20000 }).catch(() => null)
  await page.click('button[type="submit"]')
  const lg = await loginResp
  console.log(`[relogin] login status=${lg?.status()}`)
  await page.waitForURL(u => u.pathname === '/dashboard', { timeout: 15000 }).catch(() => {})
  await dumpStorage(page, 'after-relogin')
  ok('Re-login returns to app', new URL(page.url()).pathname === '/dashboard', page.url())
  await shot(page, '10-relogin')

  // ---------- 13. MOBILE VIEWPORT SPOT CHECK ----------
  const mob = await ctx.browser().newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
  const mp = await mob.newPage()
  await mp.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60000 })
  const noOverflow = await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  ok('Mobile 360px: no horizontal overflow', noOverflow, `scrollW=${await mp.evaluate(() => document.documentElement.scrollWidth)}`)
  await mp.screenshot({ path: `${SHOTS}/11-mobile.png` })
  await mob.close()

} catch (e) {
  ok('SCRIPT CRASHED', false, e.message.slice(0, 200))
  await shot(page, '99-crash')
}

// ---------- SUMMARY ----------
console.log('\n===== CONSOLE ERRORS (' + consoleErrors.length + ') =====')
console.log([...new Set(consoleErrors)].slice(0, 10).join('\n') || 'none')
console.log('\n===== HTTP >=400 (' + apiFailures.length + ') =====')
console.log([...new Set(apiFailures)].slice(0, 10).join('\n') || 'none')
const passed = results.filter(r => r.pass).length
console.log(`\n========== RESULT: ${passed}/${results.length} PASSED ==========`)
await browser.close()
process.exit(passed === results.length ? 0 : 1)
