/* FlowSync AI — Pure unit tests (no server, no DB).
 * Covers error normalization and AI model-tier helpers. Run standalone or via
 * `npm test` (runs after the integration harness). */

const results = []
const errors = []

function log(name, ok, detail) {
  results.push({ name, ok, detail })
  const mark = ok ? 'PASS' : 'FAIL'
  console.log(`[${mark}] ${name}${detail ? ` :: ${detail}` : ''}`)
  if (!ok) errors.push(`[FAIL] ${name} :: ${detail}`)
}

async function t(name, fn) {
  try {
    const res = await fn()
    log(name, res === true, res === true ? undefined : res)
  } catch (e) {
    log(name, false, `EXCEPTION: ${e.message}`)
  }
}

async function main() {
  const { normalizeError } = require('../utils/errorHandler')
  const { resolveModels, MODEL_TIERS, dedupeHistory, detectLanguageSwitch, parseChatStreamOutput, createReplyTokenizer } = require('../services/aiService')
  const { localDateKey } = require('../utils/dateKey')

  console.log('===== UNIT TESTS (error handler + AI helpers) =====')

  await t('normalizeError: Mongoose validation -> 400 VALIDATION_ERROR', async () => {
    const err = new Error('x')
    err.name = 'ValidationError'
    err.errors = { title: { message: 'Title is required' }, priority: { message: 'Bad enum' } }
    const n = normalizeError(err)
    return n.statusCode === 400 && n.code === 'VALIDATION_ERROR' && n.message.includes('Title is required')
  })
  await t('normalizeError: duplicate key -> 409 DUPLICATE_FIELD', async () => {
    const err = new Error('dup'); err.code = 11000
    const n = normalizeError(err)
    return n.statusCode === 409 && n.code === 'DUPLICATE_FIELD'
  })
  await t('normalizeError: CastError -> 400 INVALID_ID', async () => {
    const err = new Error('cast'); err.name = 'CastError'
    const n = normalizeError(err)
    return n.statusCode === 400 && n.code === 'INVALID_ID'
  })
  await t('normalizeError: bad JSON body -> 400 INVALID_JSON', async () => {
    const err = new Error('bad json'); err.type = 'entity.parse.failed'
    const n = normalizeError(err)
    return n.statusCode === 400 && n.code === 'INVALID_JSON'
  })
  await t('normalizeError: oversized payload -> 413 PAYLOAD_TOO_LARGE', async () => {
    const err = new Error('big'); err.type = 'entity.too.large'
    const n = normalizeError(err)
    return n.statusCode === 413 && n.code === 'PAYLOAD_TOO_LARGE'
  })
  await t('normalizeError: explicit statusCode passthrough', async () => {
    const err = new Error('nope'); err.statusCode = 429; err.code = 'RATE_LIMITED'
    const n = normalizeError(err)
    return n.statusCode === 429 && n.code === 'RATE_LIMITED'
  })
  await t('normalizeError: unknown error -> 500 SERVER_ERROR', async () => {
    const n = normalizeError(new Error('boom'))
    return n.statusCode === 500 && n.code === 'SERVER_ERROR'
  })

  await t('normalizeError: AiServiceUnavailableError -> 503 AI_SERVICE_UNAVAILABLE', async () => {
    const { AiServiceUnavailableError } = require('../utils/errors')
    const n = normalizeError(new AiServiceUnavailableError('down'))
    return n.statusCode === 503 && n.code === 'AI_SERVICE_UNAVAILABLE'
  })

  await t('normalizeError: NotFoundError -> 404 NOT_FOUND', async () => {
    const { NotFoundError } = require('../utils/errors')
    const n = normalizeError(new NotFoundError('gone'))
    return n.statusCode === 404 && n.code === 'NOT_FOUND' && n.message === 'gone'
  })

  await t('validation: authSchemas.signup rejects bad email', async () => {
    const { authSchemas } = require('../utils/validation')
    const r = authSchemas.signup.safeParse({ name: 'John', email: 'not-an-email', password: 'Password123!' })
    return !r.success && r.error.issues[0].message.includes('email')
  })

  await t('validation: authSchemas.signup rejects weak password', async () => {
    const { authSchemas } = require('../utils/validation')
    const r = authSchemas.signup.safeParse({ name: 'John', email: 'j@x.com', password: 'short' })
    return !r.success
  })

  await t('validation: taskSchemas.create rejects empty title', async () => {
    const { taskSchemas } = require('../utils/validation')
    const r = taskSchemas.create.safeParse({ title: '  ' })
    return !r.success && r.error.issues[0].message.includes('Title')
  })

  await t('validation: taskSchemas.create strips unknown fields (mass assignment)', async () => {
    const { taskSchemas } = require('../utils/validation')
    const r = taskSchemas.create.safeParse({ title: 'Forge', _id: '66c0a00000000000000000aa', isAdmin: true })
    return r.success && !('_id' in r.data) && !('isAdmin' in r.data)
  })

  await t('validation: taskSchemas.create accepts valid task', async () => {
    const { taskSchemas } = require('../utils/validation')
    const r = taskSchemas.create.safeParse({ title: 'Ship v2', priority: 'high', deadline: '2026-08-15T10:00:00.000Z' })
    return r.success && r.data.priority === 'high'
  })

  await t('validation: aiSchemas.chat rejects empty message', async () => {
    const { aiSchemas } = require('../utils/validation')
    const r = aiSchemas.chat.safeParse({ message: '' })
    return !r.success && r.error.issues[0].message.includes('Message')
  })
  await t('resolveModels: AI_MODEL always first', async () => {
    process.env.AI_MODEL = 'custom/model'
    const m = resolveModels('medium')
    return m[0].provider === 'openrouter' && m[0].model === 'custom/model'
  })
  await t('resolveModels: known quality uses its tier', async () => {
    process.env.AI_MODEL = ''
    const low = resolveModels('low')
    const high = resolveModels('high')
    return MODEL_TIERS.low.every(x => low.some(r => r.provider === x.provider && r.model === x.model)) &&
      MODEL_TIERS.high.every(x => high.some(r => r.provider === x.provider && r.model === x.model))
  })
  await t('resolveModels: unknown quality falls back to default chain', async () => {
    const m = resolveModels('unknown-tier')
    return m.length >= MODEL_TIERS.medium.length
  })
  await t('resolveModels: chat history drops duplicate trailing user msg', async () => {
    const history = [
      { role: 'user', text: 'hello' },
      { role: 'ai', text: 'hi!' },
      { role: 'user', text: 'plan my day' },
    ]
    const out = dedupeHistory(history, 'plan my day')
    return out.length === 2 && out[1].role === 'ai'
  })
  await t('resolveModels: history keeps distinct trailing user msg', async () => {
    const history = [{ role: 'user', text: 'different message' }]
    return dedupeHistory(history, 'current message').length === 1
  })
  await t('localDateKey: zero-pads month/day', async () => {
    const d = new Date(2026, 0, 5)
    return localDateKey(d) === '2026-01-05'
  })
  await t('localDateKey: today matches Date.now', async () => {
    const n = new Date()
    return localDateKey() === `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
  })

  await t('detectLanguageSwitch: "talk to me in Spanish"', async () => {
    const lang = detectLanguageSwitch('talk to me in Spanish from now on')
    return lang && lang.name === 'Spanish'
  })
  await t('detectLanguageSwitch: "ab French me baat karo" (Hinglish)', async () => {
    const lang = detectLanguageSwitch('ab French me baat karo')
    return lang && lang.name === 'French'
  })
  await t('detectLanguageSwitch: "फ्रेंच में बात करो" (Devanagari)', async () => {
    const lang = detectLanguageSwitch('अब तुम फ्रेंच में बात करो')
    return lang && lang.name === 'French'
  })
  await t('detectLanguageSwitch: "स्पेनिश में बोलो"', async () => {
    const lang = detectLanguageSwitch('मुझसे स्पेनिश में बोलो')
    return lang && lang.name === 'Spanish'
  })
  await t('detectLanguageSwitch: "switch to Japanese"', async () => {
    const lang = detectLanguageSwitch('switch to Japanese')
    return lang && lang.name === 'Japanese'
  })
  await t('detectLanguageSwitch: "habla español"', async () => {
    const lang = detectLanguageSwitch('habla español ahora')
    return lang && lang.name === 'Spanish'
  })
  await t('detectLanguageSwitch: normal English msg ignored', async () => {
    return detectLanguageSwitch('plan my day and tell me what to focus on') === null
  })
  await t('detectLanguageSwitch: homework mention ignored', async () => {
    return detectLanguageSwitch('help me with my spanish homework please') === null
  })

  await t('parseChatStreamOutput: splits reply from JSON', async () => {
    const out = parseChatStreamOutput('**Plan:**\n\n- do x\n\n===TASKS_JSON===\n{"tasks":[{"title":"do x"}],"actions":[],"suggestions":["next?"]}')
    return out.reply === '**Plan:**\n\n- do x' && out.tasks[0].title === 'do x' && out.suggestions[0] === 'next?'
  })
  await t('parseChatStreamOutput: extracts actions', async () => {
    const out = parseChatStreamOutput('done\n\n===TASKS_JSON===\n{"tasks":[],"actions":[{"taskId":"abc","action":"complete"}],"suggestions":[]}')
    return out.reply === 'done' && out.actions[0].action === 'complete'
  })
  await t('parseChatStreamOutput: legacy JSON fallback', async () => {
    const out = parseChatStreamOutput('{"reply":"hi there","tasks":[],"suggestions":["s1"]}')
    return out.reply === 'hi there' && out.suggestions[0] === 's1'
  })
  await t('parseChatStreamOutput: no delimiter falls back to raw text', async () => {
    const out = parseChatStreamOutput('just a plain reply with no json')
    return out.reply === 'just a plain reply with no json' && out.tasks.length === 0
  })
  await t('createReplyTokenizer: streams only reply, stops at delimiter', async () => {
    let text = ''
    const tok = createReplyTokenizer((t) => { text += t })
    ;['Sure! ', '**plan**', '\n- a\n\n===TASKS_JSON===\n', '{"tasks":[]}'].forEach(tok)
    return text === 'Sure! **plan**\n- a\n\n'
  })
  await t('createReplyTokenizer: JSON-only output streams nothing', async () => {
    let text = ''
    const tok = createReplyTokenizer((t) => { text += t })
    ;['{"re', 'ply":"hi"}'].forEach(tok)
    return text === ''
  })
  await t('createReplyTokenizer: code-fenced JSON streams nothing', async () => {
    let text = ''
    const tok = createReplyTokenizer((t) => { text += t })
    ;['```json\n', '{"tasks', '":[]}```'].forEach(tok)
    return text === ''
  })
  await t('createReplyTokenizer: preamble before JSON leaks no JSON', async () => {
    let text = ''
    const tok = createReplyTokenizer((t) => { text += t })
    ;['Sure, ', 'here it is: ', '{"tasks":[', '{"title":"x"}]}'].forEach(tok)
    return text === 'Sure, here it is:'
  })
  await t('parseChatStreamOutput: code-fenced JSON with reply', async () => {
    const out = parseChatStreamOutput('```json\n{"reply":"hi there","tasks":[],"suggestions":["s1"]}\n```')
    return out.reply === 'hi there' && out.suggestions[0] === 's1'
  })
  await t('parseChatStreamOutput: JSON with no reply field never returns raw JSON', async () => {
    const out = parseChatStreamOutput('{"tasks":[{"title":"x"}],"suggestions":[]}')
    return !out.reply.includes('"tasks"') && out.reply.length > 0 && out.tasks[0].title === 'x'
  })
  await t('parseChatStreamOutput: preamble + JSON without reply keeps text', async () => {
    const out = parseChatStreamOutput('Here is your plan\n{"tasks":[{"title":"x"}],"suggestions":["y"]}')
    return out.reply === 'Here is your plan' && out.tasks[0].title === 'x'
  })

  const passed = results.filter((r) => r.ok).length
  const failed = results.length - passed
  console.log('\n==========================================')
  console.log(`UNIT RESULTS: ${passed} PASSED, ${failed} FAILED, ${results.length} TOTAL`)
  console.log('==========================================')
  if (errors.length) {
    console.log('\nFAILED TESTS:')
    errors.forEach((e) => console.log('  ' + e))
  }
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('UNIT HARNESS FATAL:', e)
  process.exit(2)
})
