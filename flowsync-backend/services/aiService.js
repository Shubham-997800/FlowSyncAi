const { getAI } = require('../config/aiConfig')

const AI_MODELS = [
  process.env.AI_MODEL,
  'meta-llama/llama-3.3-70b-instruct',
  'openai/gpt-4o-mini',
  'anthropic/claude-3-haiku-20240307',
  'cohere/command-r-plus',
  'mistralai/mistral-small-24b-instruct-2501',
  'google/gemini-2.0-flash-001',
].filter(Boolean)

async function callAI(systemMsg, userMsg, temperature = 0.7) {
  const ai = getAI()
  for (const model of AI_MODELS) {
    try {
      const res = await ai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        temperature,
        max_tokens: 4096,
      })
      const content = res.choices[0]?.message?.content || ''
      if (content) {
        console.log(`[AI] ${model} responded successfully`)
        return content
      }
    } catch (err) {
      const info = `${err.message || ''} ${err.error?.message || ''}`
      console.log(`[AI] ${model} failed: ${info.slice(0, 100)}`)
      const status = err.status || err.error?.code || 0
      if (status === 401 || status === 402 || info.includes('401') || info.includes('402') || info.includes('invalid_api_key') || info.includes('Incorrect API key')) {
        throw new Error('AI_SERVICE_UNAVAILABLE')
      }
    }
  }
  console.log('[AI] All models failed')
  throw new Error('AI_SERVICE_UNAVAILABLE')
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

  const raw = await callAI(sysMsg, userMsg, 0.3)
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

  const raw = await callAI(sysMsg, userMsg, 0.3)
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

  const raw = await callAI(sysMsg, userMsg, 0.3)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.criticalTasks)) return parsed
  return { criticalTasks: [], compressedSchedule: [], dropRecommendations: [], timeCompressionStrategy: '', estimatedRecoveryHours: 0 }
}

async function chat(message, tasks = []) {
  const sysMsg = `You are FlowSync AI, a friendly and conversational productivity assistant inside a task management app. Your tone is warm, helpful, and natural — like a smart coworker.

Your job:
- Answer questions about tasks, productivity, and planning.
- If the user asks to create a task, extract it into the "tasks" JSON array.
- Give concise, practical advice. Use natural language, not robotic phrases.
- Suggest follow-up actions when appropriate.

When you respond, output ONLY valid JSON — no markdown, no extra text. Use this format:
{
  "reply": "your warm, natural conversational response here",
  "tasks": [{ "title": "task title", "description": "optional description", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["follow-up suggestion 1", "follow-up suggestion 2"]
}

If the user does NOT ask to create any tasks, set "tasks" to an empty array [].`

  const userMsg = `Here are the user's current tasks for context:
${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline, status: t.status })))}

User message: "${message}"

Remember: Respond with **natural, conversational** language in the "reply" field. Be concise but human.`

  const raw = await callAI(sysMsg, userMsg, 0.7)
  const parsed = parseJSON(raw)
  if (parsed && parsed.reply) return parsed
  return { reply: "I understand what you're saying. Could you be more specific about what you'd like me to help with?", tasks: [], suggestions: [] }
}

async function chatWithContext(message, tasks = [], goals = [], habits = []) {
  const sysMsg = `You are FlowSync AI, a friendly and conversational productivity assistant. Your tone is warm, helpful, and natural — like a smart coworker.

Your job:
- Answer questions about tasks, goals, habits, and productivity.
- If the user asks to create a task, extract it into the "tasks" JSON array.
- Keep responses concise but human. Use the user's name and context.
- Suggest follow-up actions when appropriate.

When you respond, output ONLY valid JSON — no markdown, no extra text. Use this format:
{
  "reply": "your warm, natural conversational response here",
  "tasks": [{ "title": "task title", "description": "optional description", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["follow-up suggestion 1", "follow-up suggestion 2"]
}

If the user does NOT ask to create any tasks, set "tasks" to an empty array [].`

  const userMsg = `User Context:
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline, status: t.status })))}
Goals: ${JSON.stringify(goals.map(g => ({ title: g.title, status: g.status, progress: g.progress })))}
Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, streak: h.streak, frequency: h.frequency })))}

User message: "${message}"

Remember: Respond with natural, conversational language. Be concise but human.`

  const raw = await callAI(sysMsg, userMsg, 0.7)
  const parsed = parseJSON(raw)
  if (parsed && parsed.reply) return parsed
  return { reply: "I understand. Could you be more specific about what you'd like help with?", tasks: [], suggestions: [] }
}

async function suggestTask(title, description = '', existingTasks = []) {
  const sysMsg = `You are FlowSync AI, a productivity assistant. Analyze a task and suggest optimal priority, estimated time, and relevant tags. Respond with valid JSON only.`
  const userMsg = `Task: "${title}" ${description ? `Description: "${description}"` : ''}
${existingTasks.length > 0 ? `Existing tasks context: ${JSON.stringify(existingTasks.map(t => ({ title: t.title, priority: t.priority, tags: t.tags })))}` : ''}

Respond EXACTLY with this JSON:
{
  "suggestedPriority": "low|medium|high",
  "suggestedEstimatedTime": 30,
  "suggestedTags": ["tag1", "tag2"],
  "reason": "Brief reason for these suggestions"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3)
  const parsed = parseJSON(raw)
  if (parsed && parsed.suggestedPriority) return parsed
  return { suggestedPriority: 'medium', suggestedEstimatedTime: 30, suggestedTags: [], reason: '' }
}

async function generateAnalyticsInsights(tasks, habits, goals) {
  const sysMsg = `You are FlowSync AI, a productivity analyst. Analyze user data and provide insights. Respond with valid JSON only.`
  const userMsg = `User data:
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status, deadline: t.deadline })))}
Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, streak: h.streak, frequency: h.frequency })))}
Goals: ${JSON.stringify(goals.map(g => ({ title: g.title, status: g.status, progress: g.progress })))}

Respond EXACTLY with this JSON:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "predictedCompletionRate": 0-100,
  "focusRecommendation": "",
  "productivityScore": 0-100
}`

  const raw = await callAI(sysMsg, userMsg, 0.3)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.recommendations)) return parsed
  return {
    strengths: ['Start tracking to get insights'],
    weaknesses: ['Not enough data yet'],
    recommendations: ['Create more tasks to get personalized analytics'],
    predictedCompletionRate: 0,
    focusRecommendation: '',
    productivityScore: 0,
  }
}

module.exports = { generatePlan, prioritizeTasks, rescueMode, chat, chatWithContext, suggestTask, generateAnalyticsInsights }
