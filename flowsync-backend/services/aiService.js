const { getAI } = require('../config/aiConfig')

async function callGrok(systemMsg, userMsg) {
  const ai = getAI()
  try {
    const res = await ai.chat.completions.create({
      model: 'qwen/qwen-2.5-7b-instruct',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    })
    return res.choices[0]?.message?.content || ''
  } catch (err) {
    const status = err.status || err.error?.code || 0
    const msg = (err.message || '') + (err.error?.message || '')
    if (
      status === 429 || status === 401 || status === 402 ||
      msg.includes('429') || msg.includes('401') || msg.includes('402') ||
      msg.includes('insufficient_quota') || msg.includes('invalid_api_key') ||
      msg.includes('Incorrect API key') || msg.includes('rate limited') ||
      msg.includes('quota') || msg.includes('Payment Required')
    ) {
      throw new Error('AI_SERVICE_UNAVAILABLE')
    }
    throw err
  }
}

function parseJSON(text) {
  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(clean) } catch {}
  const start = clean.indexOf('{'), end = clean.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(clean.slice(start, end + 1)) } catch {}
  }
  return null
}

async function generatePlan(prompt, tasks = []) {
  const sysMsg = `You are FlowSync AI, a productivity engine. Generate a daily plan in JSON. Always respond with valid JSON only.`
  const userMsg = `USER: "${prompt}"

TASKS: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "priority": [{ "taskId": "", "title": "", "reason": "", "score": 0 }],
  "schedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "", "type": "work|break|buffer" }],
  "suggestions": ["string"],
  "confidence": 0-100
}`

  const raw = await callGrok(sysMsg, userMsg)
  return parseJSON(raw) || { priority: [], schedule: [], suggestions: ['Could not generate plan'], confidence: 0 }
}

async function prioritizeTasks(tasks) {
  const sysMsg = `You are FlowSync AI, a productivity engine. Rank tasks by urgency and importance in JSON. Always respond with valid JSON only.`
  const userMsg = `Rank these tasks:

${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "rankings": [{ "taskId": "", "title": "", "priorityScore": 0-100, "riskScore": 0-100, "reason": "" }],
  "suggestedOrder": ["taskId1"],
  "summary": ""
}`

  const raw = await callGrok(sysMsg, userMsg)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.rankings)) return parsed
  return {
    rankings: tasks.map(t => ({ taskId: t._id, title: t.title, priorityScore: 50, riskScore: 50, reason: 'Default' })),
    suggestedOrder: tasks.map(t => t._id.toString()),
    summary: '',
  }
}

async function rescueMode(tasks) {
  const sysMsg = `You are FlowSync AI, a productivity engine. EMERGENCY: User is overloaded with only a 48h window. Respond with JSON only.`
  const userMsg = `Tasks: ${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "criticalTasks": [{ "taskId": "", "title": "", "reason": "" }],
  "compressedSchedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "" }],
  "dropRecommendations": ["title"],
  "timeCompressionStrategy": "",
  "estimatedRecoveryHours": 0
}`

  const raw = await callGrok(sysMsg, userMsg)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.criticalTasks)) return parsed
  return { criticalTasks: [], compressedSchedule: [], dropRecommendations: [], timeCompressionStrategy: '', estimatedRecoveryHours: 0 }
}

async function chat(message, tasks = []) {
  const sysMsg = `You are FlowSync AI, a friendly productivity assistant inside a task management app. You help users plan, organize, and create tasks. If the user asks you to create a task, respond with a "tasks" array. Always respond with valid JSON only.`

  const userMsg = `Current tasks: ${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline, status: t.status })))}

User said: "${message}"

Respond EXACTLY with this JSON format:
{
  "reply": "your friendly conversational response here",
  "tasks": [{ "title": "task title", "description": "", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["optional follow-up suggestions"]
}
If the user doesn't ask to create tasks, return "tasks" as empty array [].`

  const raw = await callGrok(sysMsg, userMsg)
  const parsed = parseJSON(raw)
  if (parsed && parsed.reply) return parsed
  return { reply: "I understand what you're saying. Could you be more specific about what you'd like me to help with?", tasks: [], suggestions: [] }
}

module.exports = { generatePlan, prioritizeTasks, rescueMode, chat }
