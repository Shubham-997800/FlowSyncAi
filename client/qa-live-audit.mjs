import { chromium } from 'playwright'
import fs from 'fs'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const SHOT = 'C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-screens'
fs.mkdirSync(SHOT, { recursive: true })

const report = { overflow: [], consoleErrors: [], axe: [], forms: [], notes: [] }
const log = (...a) => console.log(...a)

// axe-core source (fetched at runtime)
let AXE = ''
try { AXE = await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js')).text() } catch { }

async function checkOverflow(page, label, w) {
  const res = await page.evaluate(() => {
    const de = document.documentElement
    return {
      scrollW: de.scrollWidth,
      clientW: de.clientWidth,
      bodyScrollW: document.body.scrollWidth,
      offenders: Array.from(document.querySelectorAll('*')).filter(el => {
        const r = el.getBoundingClientRect()
        return r.right > de.clientWidth + 1 && r.left > 0 && !el.closest('[aria-hidden="true"]')
      }).slice(0, 5).map(el => `${el.tagName}.${(el.className + '').toString().slice(0, 60)}`),
    }
  })
  if (res.scrollW > res.clientW + 1) {
    report.overflow.push({ viewport: w, page: label, scrollW: res.scrollW, clientW: res.clientW, offenders: res.offenders.slice(0, 3) })
    log(`  OVERFLOW ${w}px ${label}: scrollW=${res.scrollW} clientW=${res.clientW}`)
  }
}

async function scanAxe(page, label) {
  if (!AXE) return
  await page.evaluate(AXE)
  const r = await page.evaluate(async () => {
    const results = await window.axe.run(document, { resultTypes: ['violations'] })
    return results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }))
  })
  if (r.length) {
    report.axe.push({ page: label, violations: r })
    log(`  AXE ${label}: ${r.length} violation types`)
  }
}

async function tryNav(page, path, label) {
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 })
  } catch { await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 }) }
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${SHOT}/${label.replace(/[^\w]+/g, '_')}.png`, fullPage: true })
  await checkOverflow(page, label, 1440)
}

const browser = await chromium.launch({ headless: true })

// ============ 1. LANDING / PUBLIC PAGES @ multiple viewports ============
log('== Public pages overflow scan ==')
const vp = [320, 375, 390, 414, 480, 768, 820, 1024, 1280, 1440, 1920]
const pubPages = [
  ['/', 'Landing'], ['/login', 'Login'], ['/register', 'Register'],
  ['/terms', 'Terms'], ['/privacy', 'Privacy'], ['/404', 'NotFound'],
]
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  page.on('pageerror', e => report.consoleErrors.push(`PUBLIC pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(`PUBLIC console: ${m.text().slice(0, 300)}`) })
  for (const [path, label] of pubPages) {
    await tryNav(page, path, label)
    await scanAxe(page, label)
    // extra small-viewport overflow check for landing
    if (label === 'Landing') {
      for (const w of vp) {
        await page.setViewportSize({ width: w, height: 800 })
        await page.waitForTimeout(200)
        await checkOverflow(page, 'Landing', w)
      }
      await page.setViewportSize({ width: 1440, height: 900 })
    }
  }
  await ctx.close()
}

// ============ 2. REGISTER ============
log('== Register ==')
const email = `qa-${randomUUID()}@test.com`
const password = 'Password123!'
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
page.on('pageerror', e => report.consoleErrors.push(`APP pageerror: ${e.message}`))
page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(`APP console: ${m.text().slice(0, 300)}`) })

// --- register form validation tests ---
await page.goto(BASE + '/register', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

// empty submit
await page.getByRole('button', { name: 'Create Account' }).click()
await page.waitForTimeout(400)
const emptyErrors = await page.locator('p,span,div').evaluateAll(els => els.filter(e => /is required|required|Please enter|valid/i.test(e.textContent || '') && e.children.length === 0).map(e => e.textContent.trim()).slice(0, 6))
report.notes.push(`REGISTER empty-submit errors: ${JSON.stringify(emptyErrors)}`)
log('  empty submit errors:', emptyErrors)

// invalid email
await page.getByLabel('Full Name', { exact: true }).fill('QA Tester')
await page.getByLabel('Email', { exact: true }).fill('not-an-email')
await page.getByLabel('Password', { exact: true }).fill('pass')
await page.getByLabel('Confirm Password', { exact: true }).fill('different')
await page.getByRole('checkbox').check()
await page.getByRole('button', { name: 'Create Account' }).click()
await page.waitForTimeout(500)
const invalidErrors = await page.locator('p,span,div').evaluateAll(els => els.filter(e => /valid|match|weak|least|characters|8/i.test(e.textContent || '') && e.children.length === 0).map(e => e.textContent.trim()).slice(0, 6))
report.notes.push(`REGISTER invalid-input errors: ${JSON.stringify(invalidErrors)}`)
log('  invalid-input errors:', invalidErrors)

// valid registration
await page.getByLabel('Full Name', { exact: true }).fill('QA Tester')
await page.getByLabel('Email', { exact: true }).fill(email)
await page.getByLabel('Password', { exact: true }).fill(password)
await page.getByLabel('Confirm Password', { exact: true }).fill(password)
await page.getByRole('checkbox').check()
await page.getByRole('button', { name: 'Create Account' }).click()
try { await page.waitForURL(/\/dashboard/, { timeout: 15000 }) } catch (e) { report.notes.push('REGISTER did not reach dashboard: ' + e.message) }
await page.waitForTimeout(1200)

// close onboarding if present
const gotIt = page.getByRole('button', { name: /Got it/i })
if (await gotIt.count()) { await gotIt.first().click(); await page.waitForTimeout(300) }
report.notes.push(`REGISTER result: URL=${page.url()}`)
await page.screenshot({ path: `${SHOT}/after_register_dashboard.png`, fullPage: false })

// ============ 3. PROTECTED PAGES scan + interaction ============
const appPages = [
  ['/dashboard', 'Dashboard'], ['/tasks', 'Tasks'], ['/ai-planner', 'AI_Chat'],
  ['/calendar', 'Calendar'], ['/focus', 'FocusMode'], ['/habits', 'Habits'],
  ['/notifications', 'Notifications'], ['/analytics', 'Analytics'],
  ['/profile', 'Profile'], ['/settings', 'Settings'],
]
log('== Protected pages ==')
for (const [path, label] of appPages) {
  await tryNav(page, path, label)
  await scanAxe(page, label)
}

// ============ 4. INTERACTION: create a task ============
log('== Task CRUD ==')
await page.goto(BASE + '/tasks', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// find create button
const addBtn = page.getByRole('button', { name: /Add Task|New Task|Create Task|Add/i }).first()
if (await addBtn.count()) {
  await addBtn.click(); await page.waitForTimeout(500)
  await page.screenshot({ path: `${SHOT}/task_create_modal.png` })
  // fill inputs
  const title = page.getByLabel(/Title|Task Name/i).first()
  if (await title.count()) {
    await title.fill('QA audit task — test 🚀 حنا hello 中文 <script>alert(1)</script>')
    const desc = page.getByLabel(/Description/i).first()
    if (await desc.count()) await desc.fill('Special chars: `<>\"& émojis 😀✅ XSS <img src=x onerror=alert(1)>')
    const save = page.getByRole('button', { name: /Save|Add|Create/i }).last()
    if (await save.count()) { await save.click(); await page.waitForTimeout(900) }
    await page.screenshot({ path: `${SHOT}/task_after_create.png` })
    report.notes.push('TASK create: attempted with special chars')
  } else report.notes.push('TASK create modal: no title input found')
} else report.notes.push('TASK page: no Add Task button found')

// ============ 5. AI CHAT ============
log('== AI Chat ==')
await page.goto(BASE + '/ai-planner', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: `${SHOT}/ai_chat_empty.png` })
const chatInput = page.locator('textarea').first()
if (await chatInput.count()) {
  await chatInput.fill('Give me a short plan for today')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(8000)
  await page.screenshot({ path: `${SHOT}/ai_chat_response.png` })
  report.notes.push('AI CHAT: sent prompt, waiting for response')
} else report.notes.push('AI CHAT: no textarea found')

// ============ 6. MOBILE scans of protected pages ============
log('== Mobile protected pages ==')
for (const w of [320, 375, 390, 414, 480, 768, 820, 1024]) {
  await page.setViewportSize({ width: w, height: 800 })
  for (const [path, label] of [['/dashboard', 'Dashboard'], ['/ai-planner', 'AI_Chat'], ['/tasks', 'Tasks'], ['/settings', 'Settings']]) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(700)
    await checkOverflow(page, label, w)
  }
}
await page.screenshot({ path: `${SHOT}/mobile_dashboard_375.png` })

// ============ 7. SETTINGS persistence ============
log('== Settings ==')
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(BASE + '/settings', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// toggle first checkbox if any
const toggles = page.locator('input[type=checkbox]')
const n = await toggles.count()
report.notes.push(`SETTINGS: found ${n} checkboxes`)
if (n) { await toggles.first().check().catch(() => {}); await page.waitForTimeout(500) }
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(600)

// ============ 8. LOGOUT + LOGIN + forgot ============
log('== Logout/Login/Forgot ==')
await page.goto(BASE + '/dashboard')
await page.waitForTimeout(800)
await page.getByRole('button', { name: 'Log out' }).click()
try { await page.waitForURL(/\/login/, { timeout: 12000 }) } catch {}
await page.waitForTimeout(600)
// forgot password link test
const forgot = page.getByRole('link', { name: /Forgot|forgot/i }).first()
if (await forgot.count()) {
  await forgot.click(); await page.waitForTimeout(700)
  await page.screenshot({ path: `${SHOT}/forgot_password.png` })
  report.notes.push('FORGOT: reached forgot-password screen')
  const fe = page.getByLabel(/Email/i).first()
  if (await fe.count()) {
    await fe.fill(email)
    const fb = page.getByRole('button', { name: /Reset|Send|Submit/i }).first()
    if (await fb.count()) { await fb.click(); await page.waitForTimeout(1200) }
  }
  await page.screenshot({ path: `${SHOT}/forgot_submitted.png` })
} else report.notes.push('FORGOT: no forgot-password link found')

// login
await page.goto(BASE + '/login', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.getByLabel('Email Address', { exact: true }).fill(email)
await page.getByLabel('Password', { exact: true }).fill(password)
await page.getByRole('button', { name: 'Sign In' }).click()
try { await page.waitForURL(/\/dashboard/, { timeout: 15000 }) } catch (e) { report.notes.push('LOGIN failed: ' + e.message) }
await page.waitForTimeout(1000)
report.notes.push(`LOGIN result: ${page.url()}`)

// ============ 9. DARK MODE scan ============
log('== Dark mode ==')
await page.getByRole('button', { name: /Switch to dark mode/i }).click().catch(async () => {
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
})
await page.waitForTimeout(700)
for (const [path, label] of [['/dashboard', 'Dashboard_dark'], ['/tasks', 'Tasks_dark'], ['/ai-planner', 'AI_dark'], ['/analytics', 'Analytics_dark']]) {
  await tryNav(page, path, label)
}
await page.goto(BASE + '/dashboard')
await page.getByRole('button', { name: /Switch to light mode/i }).click().catch(() => {})
await page.waitForTimeout(400)

// ============ 10. DELETE ACCOUNT area (cancel only) ============
log('== Profile/Delete ==')
await page.goto(BASE + '/profile', { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
const delBtn = page.getByRole('button', { name: /Delete Account|Delete my account|Delete/i }).first()
if (await delBtn.count()) {
  await delBtn.click(); await page.waitForTimeout(600)
  await page.screenshot({ path: `${SHOT}/delete_account_dialog.png` })
  report.notes.push('DELETE ACCOUNT: dialog opened (cancelled)')
  const cancel = page.getByRole('button', { name: /Cancel|Never mind/i }).first()
  if (await cancel.count()) await cancel.click()
} else report.notes.push('PROFILE: no delete-account button found')

await page.screenshot({ path: `${SHOT}/final_profile.png` })

await ctx.close()
await browser.close()

// ============ OUTPUT ============
console.log('\n\n========== AUDIT SUMMARY ==========')
console.log('OVERFLOW ISSUES:', report.overflow.length)
for (const o of report.overflow) console.log('  -', o.viewport, 'px |', o.page, '| scrollW', o.scrollW, '> clientW', o.clientW, '| offenders:', o.offenders.join('; '))
console.log('\nCONSOLE ERRORS:', report.consoleErrors.length)
for (const c of report.consoleErrors.slice(0, 25)) console.log('  -', c)
console.log('\nAXE VIOLATIONS BY PAGE:')
for (const a of report.axe) {
  console.log('  PAGE', a.page)
  for (const v of a.violations) console.log(`    [${v.impact}] ${v.id} (${v.nodes} nodes) :: ${v.targets.join(' | ')}`)
}
console.log('\nNOTES:')
for (const n of report.notes) console.log('  -', n)

fs.writeFileSync('C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-audit.json', JSON.stringify(report, null, 2))
console.log('\nSaved screenshots to', SHOT)
