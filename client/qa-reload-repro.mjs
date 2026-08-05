import { chromium } from 'playwright'
import fs from 'fs'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const SHOT = 'C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-screens'

const email = `qa-reload-${randomUUID()}@test.com`
const password = 'Password123!'

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const events = []
page.on('pageerror', e => events.push(`pageerror: ${e.message}`))
page.on('console', m => { if (m.type() === 'error') events.push(`console: ${m.text().slice(0, 250)}`) })

// register + login
await page.goto(BASE + '/register', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.getByLabel('Full Name', { exact: true }).fill('Reload Tester')
await page.getByLabel('Email', { exact: true }).fill(email)
await page.getByLabel('Password', { exact: true }).fill(password)
await page.getByLabel('Confirm Password', { exact: true }).fill(password)
await page.getByRole('checkbox').check()
await page.getByRole('button', { name: 'Create Account' }).click()
await page.waitForURL(/\/dashboard/, { timeout: 20000 })
await page.waitForTimeout(1500)
await page.getByRole('button', { name: /Got it/i }).first().click().catch(() => {})
await page.waitForTimeout(500)

// seed a task so dashboard renders non-empty
await page.evaluate(() => localStorage.removeItem('flowsync_widgets'))

// reload N times rapidly
for (let i = 1; i <= 16; i++) {
  events.length = 0
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  const errText = await page.locator('h1, h2').allInnerTexts()
  const hasError = errText.some(t => /something went wrong/i.test(t))
  await page.screenshot({ path: `${SHOT}/reload_${String(i).padStart(2, '0')}.png` })
  const errs = [...events]
  if (hasError || errs.length) {
    console.log(`--- reload ${i}: errorBoundary=${hasError}`)
    for (const e of errs.slice(0, 6)) console.log('    ', e)
  }
  if (hasError) break
  await page.waitForTimeout(300)
}

await ctx.close()
await browser.close()
console.log('done')
