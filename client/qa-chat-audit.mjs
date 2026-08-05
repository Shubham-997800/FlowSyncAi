import { chromium } from 'playwright'
import { randomUUID } from 'node:crypto'

const BASE = 'https://flowsyncai30.vercel.app'
const SHOT = 'C:/Users/SHUBH/AppData/Local/Temp/opencode/qa-screens'
import fs from 'fs'
fs.mkdirSync(SHOT, { recursive: true })

const email = `qa-chat-${randomUUID()}@test.com`
const password = 'Password123!'
const browser = await chromium.launch({ headless: true })

const res = await fetch(BASE + '/api/auth/signup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Chat QA', email, password }),
})
const signup = await res.json()
const token = signup.token

// seed chat messages with hostile long content
const sid = 'audit-session-1'
const messages = [
  { sessionId: sid, role: 'user', text: 'Can you create a very detailed plan for this extremely long project milestone that will take many weeks to complete successfully?' },
  { sessionId: sid, role: 'ai', text: 'Here is a super long unbroken string to test overflow: https://verylongdomainname.example.com/some/very/long/path/that/never/breaks/1234567890123456789012345678901234567890!@#$%^&*()_+{}|:"<>?', tasks: [], suggestions: [] },
  { sessionId: sid, role: 'ai', text: 'हिंदी में जवाब देने की कोशिश करें और बहुत लंबा पैराग्राफ लिखें ताकि टेक्स्ट रैपिंग और मोबाइल डिस्प्ले पर टेस्ट हो सके। यह एक बहुत ही लंबा संदेश है जिसे हम जानबूझकर भेज रहे हैं।', tasks: [], suggestions: [] },
  { sessionId: sid, role: 'ai', text: 'const x = "This is a long code string"; function veryLongFunctionName(argumentNumberOne, argumentNumberTwo, argumentNumberThree) { return argumentNumberOne + argumentNumberTwo * argumentNumberThree; } // end of the very long code line', tasks: [], suggestions: [] },
  { sessionId: sid, role: 'user', text: 'बहुत लंबा उपयोगकर्ता संदेश जो मोबाइल स्क्रीन पर overflow कर सकता है इसलिए इसे ब्रेक होना चाहिए और ठीक से रैप होना चाहिए।', tasks: [], suggestions: [] },
]
for (const m of messages) {
  await fetch(BASE + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(m),
  })
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false })
const page = await ctx.newPage()
await page.addInitScript(({ token, user }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', 'x')
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('flowsync_onboard_shown_v1', '1')
}, { token, user: signup.user })

const widths = [320, 360, 375, 390, 414, 480, 600, 768, 820, 1024, 1280, 1440, 1920]
const issues = []

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 700 })
  await page.goto(BASE + '/ai-planner', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(1400)

  const m = await page.evaluate(() => {
    const de = document.documentElement
    const overflow = {
      pageScrollW: de.scrollWidth,
      pageClientW: de.clientWidth,
    }
    // find elements overflowing viewport
    const offenders = []
    const all = document.querySelectorAll('*')
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.left > de.clientWidth + 1 || r.right > de.clientWidth + 1 || r.right < -1) {
        if (el.closest('[aria-hidden="true"]')) continue
        const cls = (el.className && el.className.toString ? el.className.toString() : '').slice(0, 50)
        offenders.push(`${el.tagName}.${cls} L:${Math.round(r.left)} R:${Math.round(r.right)}`)
      }
    }
    // input row: is send button below visible viewport (mobile url-bar issue)?
    const input = document.querySelector('input[placeholder*="Ask me anything"]') || document.querySelector('input')
    let sendBtn = null
    document.querySelectorAll('button').forEach(b => { if ((b.textContent || '') === '' && !sendBtn) sendBtn = b })
    // find the send button (last in input row)
    const btns = [...document.querySelectorAll('button')]
    let send = null
    for (const b of btns) {
      const svg = b.querySelector('svg')
      if (svg && b.getBoundingClientRect().top > window.innerHeight - 180) send = b
    }
    const sendRect = send ? send.getBoundingClientRect() : null
    return {
      overflow,
      offenders: offenders.slice(0, 8),
      viewportH: window.innerHeight,
      docH: document.documentElement.scrollHeight,
      sendRect: sendRect ? { top: Math.round(sendRect.top), bottom: Math.round(sendRect.bottom), h: Math.round(sendRect.height), w: Math.round(sendRect.width) } : null,
      inputRect: input ? (() => { const r = input.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width) } })() : null,
    }
  })

  const flags = []
  if (m.overflow.pageScrollW > m.overflow.pageClientW + 1) flags.push(`PAGE-OVERFLOW scrollW=${m.overflow.pageScrollW}`)
  if (m.offenders.length) flags.push(`OFFENDERS=${m.offenders.slice(0, 3).join(' | ')}`)
  if (m.sendRect && m.sendRect.bottom > m.viewportH) flags.push(`SEND-BTN-CLIPPED bottom=${m.sendRect.bottom} vh=${m.viewportH}`)
  if (m.sendRect && (m.sendRect.h < 40 || m.sendRect.w < 40)) flags.push(`SEND-BTN-SMALL ${m.sendRect.w}x${m.sendRect.h}`)

  await page.screenshot({ path: `${SHOT}/chat_${w}.png` })
  if (flags.length) {
    issues.push({ w, flags })
    console.log(`>>> ${w}px: ${flags.join('  ')}`)
  } else {
    console.log(`    ${w}px: OK  (send=${m.sendRect ? m.sendRect.w + 'x' + m.sendRect.h + ' bottom=' + m.sendRect.bottom : 'n/a'} vh=${m.viewportH})`)
  }
}

// Also test mobile emulation (iPhone) with real mobile viewport for 100vh / keyboard issues
const mobCtx = await browser.newContext({ ...devicesIphone })
async function devicesIphone() { return {} }

await ctx.close()
await browser.close()
console.log('\nTotal issue widths:', issues.length)
