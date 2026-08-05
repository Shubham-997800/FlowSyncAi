import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'
const browser = await chromium.launch({ headless: true })
const user = { _id: 'local-audit', name: 'Local Audit', email: 'audit@local.test' }

const widths = [320, 360, 375, 390, 414, 480, 768, 820, 1024]

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 700 }, isMobile: w < 500, hasTouch: w < 500 })
  const page = await ctx.newPage()
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', 'x')
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('flowsync_onboard_shown_v1', '1')
  }, { token: 'local-audit-token', user })

  await page.goto(BASE + '/ai-planner', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1400)

  const m = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const res = { vw, vh, header: null, overflowWithin: [] }

    const h1 = [...document.querySelectorAll('h1')].find(h => h.textContent.includes('AI Assistant'))
    if (h1) {
      const header = h1.closest('div[class*="justify-between"]')
      res.header = header ? { scrollW: header.scrollWidth, clientW: header.clientWidth } : null
      const title = h1.closest('div.min-w-0')
      res.titleBlock = title ? { scrollW: title.scrollWidth, clientW: title.clientWidth } : null
    }

    let maxRight = 0, maxRightEl = null
    for (const el of document.querySelectorAll('*')) {
      const b = el.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) continue
      if (b.left < -50) continue
      if (b.right > maxRight) { maxRight = b.right; maxRightEl = el }
    }
    res.maxRight = { right: Math.round(maxRight), el: maxRightEl ? (maxRightEl.tagName + '.' + (maxRightEl.className && maxRightEl.className.toString ? maxRightEl.className.toString().slice(0, 40) : '')) : '' }

    return res
  })

  console.log(`${w}px  header scrollW/clientW: ${m.header ? m.header.scrollW + '/' + m.header.clientW + '  titleW: ' + m.titleBlock.scrollW + '/' + m.titleBlock.clientW : '?'}  maxRight: ${JSON.stringify(m.maxRight)}`)
  await ctx.close()
}
await browser.close()
console.log('done')
