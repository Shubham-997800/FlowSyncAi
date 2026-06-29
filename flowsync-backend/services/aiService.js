const { getAI } = require('../config/aiConfig')

const SYSTEM_PROMPT = `You are FlowSync AI, a productivity engine. Always respond with valid JSON only. No markdown, no explanations.`

async function callGrok(prompt) {
  const ai = getAI()
  try {
    const res = await ai.chat.completions.create({
      model: 'grok-4.3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })
    return res.choices[0]?.message?.content || ''
  } catch (err) {
    if (err.message && err.message.includes('429')) {
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
  const fullPrompt = `${SYSTEM_PROMPT}

Generate a daily plan.

USER: "${prompt}"

TASKS: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY:
{
  "priority": [{ "taskId": "", "title": "", "reason": "", "score": 0 }],
  "schedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "", "type": "work|break|buffer" }],
  "suggestions": ["string"],
  "confidence": 0-100
}`

  const raw = await callGrok(fullPrompt)
  return parseJSON(raw) || { priority: [], schedule: [], suggestions: ['Could not generate plan'], confidence: 0 }
}

async function prioritizeTasks(tasks) {
  const prompt = `${SYSTEM_PROMPT}

Rank these tasks by urgency and importance.

${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY:
{
  "rankings": [{ "taskId": "", "title": "", "priorityScore": 0-100, "riskScore": 0-100, "reason": "" }],
  "suggestedOrder": ["taskId1"],
  "summary": ""
}`

  const raw = await callGrok(prompt)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.rankings)) return parsed
  return {
    rankings: tasks.map(t => ({ taskId: t._id, title: t.title, priorityScore: 50, riskScore: 50, reason: 'Default' })),
    suggestedOrder: tasks.map(t => t._id.toString()),
    summary: '',
  }
}

async function rescueMode(tasks) {
  const prompt = `${SYSTEM_PROMPT}

EMERGENCY: User is overloaded. Only 48h window.

${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY:
{
  "criticalTasks": [{ "taskId": "", "title": "", "reason": "" }],
  "compressedSchedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "" }],
  "dropRecommendations": ["title"],
  "timeCompressionStrategy": "",
  "estimatedRecoveryHours": 0
}`

  const raw = await callGrok(prompt)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.criticalTasks)) return parsed
  return { criticalTasks: [], compressedSchedule: [], dropRecommendations: [], timeCompressionStrategy: '', estimatedRecoveryHours: 0 }
}

async function chat(message, tasks = []) {
  const prompt = `${SYSTEM_PROMPT}

You are a productivity assistant inside a task management app called FlowSync.
You help users plan, organize, and create tasks.
If the user asks you to create a task, respond with a "tasks" array in your JSON.

Current tasks: ${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline, status: t.status })))}

User said: "${message}"

Respond EXACTLY with this JSON format:
{
  "reply": "your friendly conversational response here",
  "tasks": [{ "title": "task title", "description": "", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["optional follow-up suggestions"]
}
If the user doesn't ask to create tasks, return "tasks" as empty array [].`

  const raw = await callGrok(prompt)
  const parsed = parseJSON(raw)
  if (parsed && parsed.reply) return parsed
  return { reply: "I understand what you're saying. Could you be more specific about what you'd like me to help with?", tasks: [], suggestions: [] }
}

module.exports = { generatePlan, prioritizeTasks, rescueMode, chat }
