import { chromium, devices } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const email = `qa-chat2-${randomUUID()}@test.com`
const password = 'Password123!'
const browser = await chromium.launch({ headless: true })

const res = await fetch(BASE + '/api/auth/signup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Chat QA2', email, password }),
})
const signup = await res.json()
const token = signup.token
const sid = 'audit-session-2'
const messages = [
  { sessionId: sid, role: 'user', text: 'Plan my day please — I have a report due and a long unbroken URL https://example.com/a/really/very/long/path/segment/that/never/breaks/anywhere/at/all/1234567890 to finish today' },
  { sessionId: sid, role: 'ai', text: 'Here is a very long response with a code snippet: const fn = (a,b,c,d,e,f,g) => { return a+b+c+d+e+f+g } and also a table: col1 col2 col3 value1 value2 value3 — all on one long line to test wrapping on small screens.', tasks: [], suggestions: [] },
  { sessionId: sid, role: 'ai', text: 'हिंदी में एक बहुत लंबा उत्तर लिखा गया है जिसे हम मोबाइल स्क्रीन पर टेस्ट कर रहे हैं ताकि टेक्स्ट सही तरीके से wrap हो और कोई भी हिस्सा कटे नहीं।', tasks: [{ title: 'Report submission', priority: 'high', deadline: '2026-08-07' }, { title: 'Team sync call', priority: 'medium', deadline: null }], suggestions: [] },
]
for (const m of messages) {
  await fetch(BASE + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(m),
  })
}

const widths = [320, 360, 375, 390, 414, 480, 768, 820, 1024]

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 700 }, isMobile: w < 500, hasTouch: w < 500 })
  const page = await ctx.newPage()
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', 'x')
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('flowsync_onboard_shown_v1', '1')
  }, { token, user: signup.user })

  await page.goto(BASE + '/ai-planner', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(1600)

  const m = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) } }
    const res = { vw, vh, header: null, bubbles: [], input: null, mic: null, send: null, chips: [], suggestionsRow: null, overflowWithin: [] }

    // chat container
    const container = document.querySelector('div.overflow-hidden') // top-level chat
    if (container) {
      const cr = container.getBoundingClientRect()
      res.container = { top: Math.round(cr.top), bottom: Math.round(cr.bottom), h: Math.round(cr.height), inViewport: cr.bottom <= vh + 1 }
    }

    // header area: find the h1 "AI Assistant"
    const h1 = [...document.querySelectorAll('h1')].find(h => h.textContent.includes('AI Assistant'))
    if (h1) {
      const header = h1.closest('div[class*="justify-between"]')
      res.header = header ? { rect: r(header), h1rect: r(h1), headerScrollW: header.scrollWidth, headerClientW: header.clientWidth } : null
    }

    // message bubbles
    document.querySelectorAll('div[class*="rounded-2xl"]').forEach(b => {
      const text = (b.textContent || '').trim()
      if (!text || text.length < 3) return
      const br = b.getBoundingClientRect()
      if (br.width < 40 || br.width > vw) return
      const sw = b.scrollWidth, cw = b.clientWidth
      res.bubbles.push({ w: Math.round(br.width), maxW: br.right <= vw + 1, textOverflow: sw > cw + 1, overflowBy: sw - cw, sample: text.slice(0, 40) })
    })

    // task cards inside chat
    document.querySelectorAll('div[class*="max-w-lg"]').forEach(c => {
      res.taskCards = res.taskCards || []
      const cr = c.getBoundingClientRect()
      res.taskCards.push({ right: Math.round(cr.right), inViewport: cr.right <= vw + 1, w: Math.round(cr.width) })
    })

    // input row: input + mic + send
    const input = document.querySelector('input[placeholder]')
    if (input && /ask|speak|anything/i.test(input.placeholder || '')) {
      res.input = r(input)
      const row = input.closest('div[class*="flex gap-2.5"]') || input.parentElement.parentElement
      if (row) {
        const btns = [...row.querySelectorAll('button')]
        const mic = btns[0], send = btns[btns.length - 1]
        res.mic = r(mic)
        res.send = r(send)
        res.inputRowBottom = r(row)?.bottom
      }
    }

    // suggestion chips
    document.querySelectorAll('button[class*="text-xs px-3.5"]').forEach(c => {
      const cr = c.getBoundingClientRect()
      res.chips.push({ right: Math.round(cr.right), inViewport: cr.right <= vw + 1 })
    })

    // any element bleeding past right edge (excluding off-canvas sidebar < -50)
    const all = document.querySelectorAll('*')
    let maxRight = 0, maxRightEl = null
    for (const el of all) {
      const b = el.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) continue
      if (b.left < -50) continue
      if (b.right > maxRight) { maxRight = b.right; maxRightEl = el }
    }
    res.maxRight = { right: Math.round(maxRight), el: maxRightEl ? (maxRightEl.tagName + '.' + (maxRightEl.className && maxRightEl.className.toString ? maxRightEl.className.toString().slice(0, 40) : '')) : '' }

    return res
  })

  console.log(`\n=== ${w}px ===`)
  console.log('  container:', JSON.stringify(m.container), 'header scrollW/clientW:', m.header ? m.header.headerScrollW + '/' + m.header.headerClientW : '?', 'maxRight:', JSON.stringify(m.maxRight))
  if (m.input) console.log('  input:', JSON.stringify(m.input), 'mic:', JSON.stringify(m.mic), 'send:', JSON.stringify(m.send), 'rowBottom:', m.inputRowBottom, 'vh:', m.vh)
  const bubbles = m.bubbles.filter(b => b.textOverflow || !b.maxW)
  if (bubbles.length) { console.log('  BUBBLE ISSUES:'); bubbles.slice(0, 5).forEach(b => console.log('    ', JSON.stringify(b))) }
  if (m.taskCards && m.taskCards.some(c => !c.inViewport)) console.log('  TASK CARD overflow:', JSON.stringify(m.taskCards))
  const badChips = m.chips.filter(c => !c.inViewport)
  if (badChips.length) console.log('  CHIP overflow:', JSON.stringify(badChips))

  await ctx.close()
}
await browser.close()
console.log('\ndone')
