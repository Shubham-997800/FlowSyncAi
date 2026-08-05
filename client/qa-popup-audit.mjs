import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const email = `qa-pop-${randomUUID()}@test.com`
const browser = await chromium.launch({ headless: true })

const signup = await (await fetch(BASE + '/api/auth/signup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'QA Pop', email, password: 'Password123!' }),
})).json()
const token = signup.token
const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
for (let i = 1; i <= 2; i++) {
  await fetch(BASE + '/api/tasks', { method: 'POST', headers: H, body: JSON.stringify({ title: `Popup task ${i}`, priority: 'medium', deadline: '2026-08-15' }) })
}
await fetch(BASE + '/api/notifications', { method: 'POST', headers: H, body: JSON.stringify({ type: 'system', title: 'Popup notification', message: 'Testing the notification popup on a mobile viewport' }) })

const W = [320, 360, 390]

const PANEL_OK = () => {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  // pick the visible overlay panel: background + z-index, not full-screen
  const candidates = [...document.querySelectorAll('div')].map(el => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const z = parseInt(cs.zIndex || '0', 10)
    return { r, z, cs }
  }).filter(({ cs, r }) => {
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    if (r.width < 150 || r.width > 900 || r.height < 60) return false
    if (r.width >= vw - 4 && r.height >= vh - 4) return false
    return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backdropFilter !== 'none'
  }).sort((a, b) => b.z - a.z || (b.r.width * b.r.height - a.r.width * a.r.height))
  const main = candidates[0] ? candidates[0].r : null
  return {
    vw, vh, main,
    fullyVisible: main ? main.left >= 0 && main.right <= vw + 1 && main.top >= 0 : null,
  }
}

async function openPanel(page, trigger) {
  try {
    await page.click(trigger, { timeout: 4000 })
    await page.waitForTimeout(500)
    return true
  } catch {
    return false
  }
}

let failures = []
const run = async (path, trigger, label, authed = true) => {
  for (const w of W) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    const errs = []
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)) })
    if (authed) {
      await page.addInitScript(({ token, user }) => {
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', 'x')
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('flowsync_onboard_shown_v1', '1')
      }, { token, user: signup.user })
    }
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 40000 })
    await page.waitForTimeout(path === '/ai-planner' || path === '/dashboard' || path === '/analytics' ? 2500 : 1200)
    if (path === '/ai-planner') {
      try { await page.click('button.md\\:hidden', { timeout: 3000 }); await page.waitForTimeout(400) } catch {}
    }
    const ok = await openPanel(page, trigger)
    if (!ok) { failures.push(`${label} @${w}: trigger not found`); await ctx.close(); continue }
    const m = await page.evaluate(PANEL_OK)
    const panelVisible = m.main && m.main.left >= 0 && m.main.right <= m.vw + 1
    if (!panelVisible) {
      failures.push(`${label} @${w}: panel OFF-SCREEN -> ${JSON.stringify(m.main)}`)
    } else {
      console.log(`  OK ${label} @${w}  panel ${m.main.w}x${m.main.h} scrollable=${m.main.scrollY}`)
    }
    if (errs.length) failures.push(`${label} @${w}: console errors -> ${JSON.stringify([...new Set(errs)].slice(0,2))}`)
    await ctx.close()
  }
}

console.log('=== Mobile popup audit ===')
await run('/dashboard', 'button[title="Customize Dashboard"]', 'dashboard widget menu')
await run('/tasks', 'button:has-text("Add Task")', 'task modal')
await run('/calendar', 'button:has-text("Add")', 'calendar modal')
await run('/habits', 'button:has-text("Add Habit")', 'habit modal')
await run('/ai-planner', 'button[title="New Chat"]', 'ai chat new chat', true)
await run('/analytics', 'button:has-text("Export")', 'export menu')
await run('/login', 'button:has-text("Terms")', 'login terms modal', false)
await run('/register', 'button:has-text("Terms")', 'register terms modal', false)

// header popups
await run('/dashboard', 'button[title="Permission status"]', 'permission monitor')
await run('/dashboard', 'button[aria-label="Keyboard shortcuts"]', 'shortcuts help desktop', true)
await run('/dashboard', 'button[title="Device guide & tips"]', 'device onboarding')
// notification popup: bell button has no title; find by aria/bell icon
{
  const bellSel = 'header button:has(svg.lucide-bell)'
  for (const w of W) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('token', token); localStorage.setItem('refreshToken', 'x'); localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('flowsync_onboard_shown_v1', '1')
    }, { token, user: signup.user })
    await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 40000 })
    await page.waitForTimeout(1800)
    const ok = await openPanel(page, bellSel)
    if (!ok) { failures.push(`notification popup @${w}: bell not found`); await ctx.close(); continue }
    const m = await page.evaluate(PANEL_OK)
    if (!(m.main && m.main.left >= 0 && m.main.right <= m.vw + 1)) failures.push(`notification popup @${w}: OFF-SCREEN -> ${JSON.stringify(m.main)}`)
    else console.log(`  OK notification popup @${w}  panel ${m.main.w}x${m.main.h}`)
    await ctx.close()
  }
}

await browser.close()
console.log('\n=== FAILURES ===')
if (!failures.length) console.log('  (none — all popups open fully on-screen)')
failures.forEach(f => console.log('  ' + f))
console.log('\ndone')
