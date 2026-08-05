import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const email = `qa-font2-${randomUUID()}@test.com`
const browser = await chromium.launch({ headless: true })

const signup = await (await fetch(BASE + '/api/auth/signup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'QA Font2', email, password: 'Password123!' }),
})).json()
const token = signup.token

const PAGES = ['/dashboard', '/tasks', '/calendar', '/focus', '/habits', '/analytics', '/notifications', '/profile', '/settings', '/ai-planner']
const WIDTHS = [320]

const SCAN = () => {
  const vw = document.documentElement.clientWidth
  const out = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const node = walker.currentNode
  const countLines = (textNode) => {
    try {
      const range = document.createRange()
      range.selectNodeContents(textNode)
      return range.getClientRects().length
    } catch { return 0 }
  }
  let n
  while ((n = walker.nextNode())) {
    const t = (n.textContent || '').trim()
    if (!t) continue
    const parent = n.parentElement
    if (!parent) continue
    const cs = getComputedStyle(parent)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (['script', 'style'].includes(parent.tagName.toLowerCase())) continue
    const lines = countLines(n)
    if (lines > 1) {
      const pRect = parent.getBoundingClientRect()
      out.push({
        tag: parent.tagName,
        cls: String(parent.className?.toString?.().slice(0, 60) || ''),
        text: t.slice(0, 50),
        lines,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        rectW: Math.round(pRect.width),
      })
    }
  }
  return { vw, wrapped: out }
}

const seen = new Set()
for (const w of WIDTHS) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', 'x')
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('flowsync_onboard_shown_v1', '1')
    }, { token, user: signup.user })
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 40000 })
    await page.waitForTimeout(path === '/dashboard' || path === '/ai-planner' ? 2000 : 1200)
    const m = await page.evaluate(SCAN)
    // group: show per-element-type list
    const byCls = {}
    m.wrapped.forEach(x => {
      const key = x.tag + '|' + x.cls + '|' + x.fontSize + '|' + x.fontWeight
      if (x.lines === 2) {
        if (!byCls[key]) byCls[key] = { ...x, count: 0, texts: [] }
        byCls[key].count++
        if (byCls[key].texts.length < 2) byCls[key].texts.push(x.text)
      }
    })
    const ks = Object.keys(byCls)
    if (ks.length) {
      console.log(`\n=== ${path} @${w}px — ${ks.length} distinct 2-line elements ===`)
      ks.slice(0, 30).forEach(k => {
        const v = byCls[k]
        console.log(`  x${v.count} <${v.tag} ${v.fontSize} ${v.fontWeight} .${v.cls}> "${v.texts.join(' | ')}"`)
      })
    }
    const keys = Object.keys(byCls)
    if (keys.length) {
      console.log(`\n=== ${path} @${w}px — ${keys.length} distinct 2-line full-width elements ===`)
      keys.slice(0, 14).forEach(k => {
        const v = byCls[k]
        console.log(`  x${v.count} <${v.tag} ${v.fontSize} ${v.fontWeight} .${v.cls}> "${v.texts.join(' | ')}"`)
      })
    }
    await ctx.close()
  }
}
await browser.close()
console.log('\ndone')
