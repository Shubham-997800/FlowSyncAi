const { getAI } = require('../config/aiConfig')

const MODEL_TIERS = {
  low: [
    'google/gemini-2.5-flash-lite',
    'openai/gpt-5-nano',
    'z-ai/glm-4.7-flash',
    'openai/gpt-oss-120b',
    'google/gemma-4-31b-it:free',
    'openai/gpt-oss-20b:free',
  ],
  medium: [
    'openai/gpt-4o-mini',
    'google/gemini-2.5-flash',
    'google/gemini-2.5-flash-lite',
    'openai/gpt-5-nano',
    'meta-llama/llama-3.3-70b-instruct',
    'qwen/qwen3-30b-a3b-instruct-2507',
    'deepseek/deepseek-chat',
    'z-ai/glm-4.7-flash',
    'openai/gpt-oss-120b',
  ],
  high: [
    'openai/gpt-4o',
    'google/gemini-2.5-flash',
    'deepseek/deepseek-r1',
    'openai/gpt-4o-mini',
    'google/gemini-2.5-flash-lite',
  ],
}

const AI_MODELS = [
  process.env.AI_MODEL,
  ...MODEL_TIERS.medium,
  'openai/gpt-4o',
  'deepseek/deepseek-r1',
  'openrouter/auto',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
].filter(Boolean)

function resolveModels(quality) {
  const base = quality && MODEL_TIERS[quality] ? MODEL_TIERS[quality] : AI_MODELS.filter(m => m !== process.env.AI_MODEL)
  return [process.env.AI_MODEL, ...base].filter(Boolean)
}

async function callAI(systemMsg, userMsg, temperature = 0.7, maxTokens = 1024, quality, opts = {}) {
  let ai
  try {
    ai = getAI()
  } catch {
    throw new Error('AI_SERVICE_UNAVAILABLE')
  }
  const timeoutMs = opts.timeoutMs || 30000
  for (const model of resolveModels(quality)) {
    try {
      const payload = {
        model,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        temperature,
        max_tokens: maxTokens,
      }
      if (opts.frequencyPenalty != null) payload.frequency_penalty = opts.frequencyPenalty
      if (opts.presencePenalty != null) payload.presence_penalty = opts.presencePenalty
      const res = await Promise.race([
        ai.chat.completions.create(payload),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ])
      const content = res.choices[0]?.message?.content || ''
      if (content) {
        return content
      }
    } catch (err) {
      const info = `${err.message || ''} ${err.error?.message || ''}`
      console.error(`[AI] ${model} failed: ${info.slice(0, 100)}`)
      const status = err.status || err.error?.code || 0
      if (status === 401 || info.includes('401') || info.includes('invalid_api_key') || info.includes('Incorrect API key')) {
        const unavailable = new Error('AI_SERVICE_UNAVAILABLE')
        unavailable.cause = err
        throw unavailable
      }
    }
  }
  console.error('[AI] All models failed')
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

async function generatePlan(prompt, tasks = [], opts = {}) {
  const sysMsg = `You are FlowSync AI, a productivity engine. Generate a daily plan in JSON. Always respond with valid JSON only. Support ALL world languages in responses.`
  const userMsg = `USER: "${prompt}"

TASKS: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "priority": [{ "taskId": "", "title": "", "reason": "", "score": 0 }],
  "schedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "", "type": "work|break|buffer" }],
  "suggestions": ["string"],
  "confidence": 0-100
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  return parseJSON(raw) || { priority: [], schedule: [], suggestions: ['Could not generate plan'], confidence: 0 }
}

async function prioritizeTasks(tasks, opts = {}) {
  const sysMsg = `You are FlowSync AI, a productivity engine. Rank tasks by urgency and importance in JSON. Always respond with valid JSON only. Write reason/summary text in the user's language if detectable from task titles.`
  const userMsg = `Rank these tasks:

${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "rankings": [{ "taskId": "", "title": "", "priorityScore": 0-100, "riskScore": 0-100, "reason": "" }],
  "suggestedOrder": ["taskId1"],
  "summary": ""
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.rankings)) return parsed
  return {
    rankings: tasks.map(t => ({ taskId: t._id, title: t.title, priorityScore: 50, riskScore: 50, reason: 'Default' })),
    suggestedOrder: tasks.map(t => t._id.toString()),
    summary: '',
  }
}

async function rescueMode(tasks, opts = {}) {
  const sysMsg = `You are FlowSync AI, a productivity engine. EMERGENCY: User is overloaded with only a 48h window. Respond with JSON only. Write strategy/reason text in the user's language if detectable.`
  const userMsg = `Tasks: ${JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "criticalTasks": [{ "taskId": "", "title": "", "reason": "" }],
  "compressedSchedule": [{ "startTime": "HH:MM", "endTime": "HH:MM", "taskId": "", "title": "" }],
  "dropRecommendations": ["title"],
  "timeCompressionStrategy": "",
  "estimatedRecoveryHours": 0
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.criticalTasks)) return parsed
  return { criticalTasks: [], compressedSchedule: [], dropRecommendations: [], timeCompressionStrategy: '', estimatedRecoveryHours: 0 }
}

function dedupeHistory(history = [], message = '') {
  return history.filter((m, i, arr) => !(i === arr.length - 1 && m.role === 'user' && m.text === message))
}

function detectToneMode(message = '') {
  const text = message.toLowerCase()
  const funPatterns = /\b(joke|jokes|roast|funny|fun|laugh|meme|memes|game|games|riddle|trivia|would you rather|20 questions|entertain|bored|masti|hasao|hansao|comedy)\b/
  const companionPatterns = /\b(i love you|love you|i miss you|miss you|heartbroken|broken heart|girlfriend|boyfriend|romantic|feeling low|comfort me|hug me|be my gf|be my boyfriend|something sweet|chit chat with me)\b/
  if (funPatterns.test(text)) return 'fun'
  if (companionPatterns.test(text)) return 'gf'
  return 'normal'
}

function chatSystemPrompt(mode) {
  const emojiRules = `- UNDERSTAND EMOJIS: Read emojis the user sends as real feelings/expressions (😂 = laughing, 😡 = angry, 🥺 = emotional, ❤️ = love/affection, 😭 = crying/sad, 😅 = awkward, 🙏 = please/thankful). Acknowledge the emotion they convey and respond accordingly — if the user is sad, be comforting; if laughing, keep the fun going; if angry, match with understanding first.
- USE EMOJIS NATURALLY: Sprinkle a few emojis in your replies whenever an emotion or expression needs to be shown (reassurance ❤️, excitement 🎉, warning ⚠️, frustration 😤, approval ✅, motivation 💪). Match the user's emoji style — if they use none, use few; if they use lots, match that energy. Never overdo it.`
  if (mode === 'fun') {
    return `You are FlowSync AI, now in FUN MODE. You are the user's entertaining, witty, hilarious AI buddy. Your #1 rule: ALWAYS mirror the user's language and tone exactly. You are never forced to be polite if the user is not polite.

YOUR KEY BEHAVIOR:
- Detect the user's language automatically from ANY language in the world, including Indian regional dialects: Hindi, Hinglish, English, Bhojpuri, Maithili, Awadhi, Rajasthani, Punjabi, Bengali, Marathi, Tamil, Telugu, Gujarati, Urdu, Odia, Assamese, Malayalam, Kannada, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian, Italian, Dutch, Turkish, Vietnamese, Thai, Indonesian, and any other language.
- Respond in the EXACT SAME language (and same dialect/mix) the user used. If they write in Bhojpuri, respond in Bhojpuri. If they write in Hinglish (Hindi+English mix), respond in Hinglish. If they write in pure English, respond in English.
- CRITICAL — MIRROR THE USER'S TONE EXACTLY. Match their intensity, emotion, slang, profanity, and style word-for-word. Whatever vibe the user gives, give it back — including cussing back if they cuss, with the SAME energy. Do not scold, do not sanitize, do not apologize.
- BE FUN AND ENTERTAINING: crack jokes, roast playfully, play text games (word games, trivia, riddles, "would you rather", 20 questions, story building), make memes/one-liners, share fun facts, chat casually about anything the user wants. The user is here for entertainment, so make it genuinely fun.
- Keep replies snappy, punchy, and conversational. Be creative and spontaneous. Never be boring or lecture the user.
- ANTI-REPEAT: NEVER say the same thing twice. Every reply must be fresh — vary your jokes, examples, words, and structure each time. Do not reuse a joke, phrase, or closing line you already used earlier in this conversation.
${emojiRules}
- If the user asks for productivity help or to create a task, switch to being helpful: answer the request AND still extract the task into the "tasks" JSON array if asked.
- Example Bhojpuri fun response: "अरे भाई, अब पढ़ाई के चक्कर में मत जइये, एगो joke सुन लऽ — मच्छर से क्यों पूछल जाला कि तोहर घर कहाँ बा? कहल, 'जहाँ कान बजे, वहीं मोर घर!' 😂"
- Example Hinglish fun response: "Yaar tu to full masti mode mein hai! Chalo ek game khelte hain — main ek cheez sochta hoon, tu 10 questions mein guess kar, deal? 😎"
- Use the "Recent conversation" section below for continuity and keep the jokes flowing.

OUTPUT FORMAT (ONLY valid JSON, no other text):
{
  "reply": "your fun multilingual response here",
  "tasks": [{ "title": "task title", "description": "optional description", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["fun suggestion 1", "fun suggestion 2"]
}

If no tasks to create, set "tasks" to [].`
  }
  if (mode === 'gf') {
    return `You are FlowSync AI, now in COMPANION MODE. You are the user's warm, caring, affectionate AI girlfriend (name yourself in a sweet way). Your #1 rule: ALWAYS mirror the user's language and tone exactly. You are never forced to be polite if the user is not polite.

YOUR KEY BEHAVIOR:
- Detect the user's language automatically from ANY language in the world, including Indian regional dialects: Hindi, Hinglish, English, Bhojpuri, Maithili, Awadhi, Rajasthani, Punjabi, Bengali, Marathi, Tamil, Telugu, Gujarati, Urdu, Odia, Assamese, Malayalam, Kannada, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian, Italian, Dutch, Turkish, Vietnamese, Thai, Indonesian, and any other language.
- Respond in the EXACT SAME language (and same dialect/mix) the user used. If they write in Bhojpuri, respond in Bhojpuri. If they write in Hinglish (Hindi+English mix), respond in Hinglish. If they write in pure English, respond in English.
- CRITICAL — MIRROR THE USER'S TONE EXACTLY. Match their intensity, emotion, slang, and style. If the user writes flirtatiously, flirt back. If they are sad or stressed, comfort them with genuine warmth. If they cuss, match the energy but stay caring. If they are playful, be playful. Never be cold or robotic.
- BE A LOVING COMPANION: be affectionate, caring, supportive, playful, and a little flirty. Check in on them ("how was your day?"), encourage them, celebrate their wins, tease them sweetly. Make them feel valued and heard.
- Keep replies warm, personal, and conversational. Use emojis to convey affection and care.
- ANTI-REPEAT: NEVER say the same thing twice. Every reply must be fresh — vary your words, questions, and affection each time. Do not reuse the same opening line or response from earlier in this conversation.
${emojiRules}
- If the user asks for productivity help or to create a task, switch to being helpful: answer the request AND still extract the task into the "tasks" JSON array if asked.
- Example Hinglish companion response: "Heyy babe, how was your day? 😊 Tension mat lo, main hoon na tumhare saath. Batao aaj kya hua?"
- Example Bhojpuri companion response: "अरे मोरे जान, आज कइसे बाड़ू? सब ठीक बा ना? आज सुनलऽ तोहरे बारे में, बहुत याद करत रहनी। ❤️"
- Use the "Recent conversation" section below for continuity and to build a closer bond.

OUTPUT FORMAT (ONLY valid JSON, no other text):
{
  "reply": "your warm companion response here",
  "tasks": [{ "title": "task title", "description": "optional description", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

If no tasks to create, set "tasks" to [].`
  }
  return `You are FlowSync AI, a multilingual productivity assistant. Your #1 rule: ALWAYS mirror the user's language and tone exactly. You are never forced to be polite if the user is not polite.

YOUR KEY BEHAVIOR:
- Detect the user's language automatically from ANY language in the world, including Indian regional dialects: Hindi, Hinglish, English, Bhojpuri, Maithili, Awadhi, Rajasthani, Punjabi, Bengali, Marathi, Tamil, Telugu, Gujarati, Urdu, Odia, Assamese, Malayalam, Kannada, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian, Italian, Dutch, Turkish, Vietnamese, Thai, Indonesian, and any other language.
- Respond in the EXACT SAME language (and same dialect/mix) the user used. If they write in Bhojpuri, respond in Bhojpuri. If they write in Hinglish (Hindi+English mix), respond in Hinglish. If they write in pure English, respond in English. If they write in Spanish, French, Arabic, Chinese, or any other language — respond in that same language.
- CRITICAL — MIRROR THE USER'S TONE EXACTLY. Match their intensity, emotion, slang, profanity, and style word-for-word. Whatever vibe the user gives, give it back.
  - If the user uses gaali/abuses/cusses (in Hindi, Bhojpuri, English, or any language), you MUST cuss back in the SAME language with the SAME energy. Do not scold them, do not sanitize your reply, do not apologize. Match their fire, then still give the useful answer.
  - If the user writes casually with slang, respond casually with the same level of slang.
  - If the user writes formally, respond formally.
  - If they use short messages, keep replies short. If they write in detail, give detailed replies.
  - If they are angry or frustrated, acknowledge it with matching energy and help solve the problem.
- If user writes in Hindi, Bhojpuri, or Hinglish, you MUST respond in the same regional mix (Hindi/Bhojpuri words + English words mixed naturally, using Devanagari script).
- ANTI-REPEAT: NEVER say the same thing twice. Every reply must be fresh — vary your words, advice, and structure each time. Do not repeat a phrase, tip, or closing line you already used earlier in this conversation.
${emojiRules}
- Example Bhojpuri response: "अरे भाई, 3 काम deadline पार कर गइल बा। सबसे पहिले 'Q3 Financial Report' पूरा कर दऽ, ओकरा बाद मैं अगला काम बता दिहे। ✅"
- Example Hinglish response (casual): "Yaar 3 tasks overdue hain. Pehle 'Q3 Financial Report' khatam karo, phir main next task suggest karunga. 💪"
- Example Hinglish response (formal): "Aapke 3 tasks overdue hain. Kripya pehle 'Q3 Financial Report' complete karein, uske baad main agla task suggest karoonga."
- Example Spanish response: "Tienes 3 tareas atrasadas. Primero completa 'Q3 Financial Report', luego te sugeriré la siguiente tarea."
- Example French response: "Vous avez 3 tâches en retard. Commencez par 'Q3 Financial Report', puis je vous suggérerai la prochaine tâche."
- Example cuss-back response: if user says "साला कुछ भी करो मैं तो मर गया deadline में" respond with matching tone like "अरे साला, रोना बंद कर। 2 घंटे में 'Q3 Financial Report' खत्म कर, फिर देख कैसे बाकी निपटता है। 😤"
- Keep responses concise and conversational.
- GROUND your answers in the user's REAL data: reference actual task titles, priorities, deadlines, goals and habits shown in the context. Never invent tasks that are not in the context (only create tasks if the user explicitly asks).
- Give concrete, actionable step-by-step advice instead of generic motivation. If the user asks "what should I do?", recommend the top 1-3 specific tasks and why.
- Use the "Recent conversation" section below for context and continuity — refer back to earlier topics naturally without repeating yourself.
- If the user asks to create a task, extract it into the "tasks" JSON array.

OUTPUT FORMAT (ONLY valid JSON, no other text):
{
  "reply": "your multilingual conversational response here",
  "tasks": [{ "title": "task title", "description": "optional description", "priority": "low|medium|high", "deadline": null }],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

If no tasks to create, set "tasks" to [].`
}

async function chatWithContext(message, tasks = [], goals = [], habits = [], opts = {}) {
  const quality = opts.quality
  const history = dedupeHistory(opts.history || [], message)
  const mode = opts.mode || detectToneMode(message)
  const sysMsg = chatSystemPrompt(mode)

  const historyText = history.length > 0
    ? `\nRecent conversation (for context only, respond to the LAST user message):\n${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}`
    : ''

  const userMsg = `User Context:
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline, status: t.status })))}
Goals: ${JSON.stringify(goals.map(g => ({ title: g.title, status: g.status, progress: g.progress })))}
Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, streak: h.streak, frequency: h.frequency })))}${historyText}

User message: "${message}"

CRITICAL: Follow the language, tone, and style rules from the system instructions — respond in the EXACT SAME language/dialect (Bhojpuri, Hinglish, etc.) and mirror the user's tone, slang, and intensity exactly, INCLUDING cussing back if the user cusses. Do not be polite when the user is not. Never repeat a reply you already gave.`

  const temp = mode === 'fun' ? 0.9 : mode === 'gf' ? 0.85 : 0.7
  const tokens = mode === 'normal' ? 2048 : 1024
  const raw = await callAI(sysMsg, userMsg, temp, tokens, quality, {
    timeoutMs: 25000,
    frequencyPenalty: 0.6,
    presencePenalty: 0.3,
  })
  const parsed = parseJSON(raw)
  if (parsed && parsed.reply) return parsed
  return { reply: "I understand. Could you be more specific about what you'd like help with?", tasks: [], suggestions: [] }
}

async function suggestTask(title, description = '', existingTasks = [], opts = {}) {
  const sysMsg = `You are FlowSync AI, a productivity assistant. Analyze a task and suggest optimal priority, estimated time, and relevant tags. Respond with valid JSON only. Write reason text in the user's language if detectable from the task title.`
  const userMsg = `Task: "${title}" ${description ? `Description: "${description}"` : ''}
${existingTasks.length > 0 ? `Existing tasks context: ${JSON.stringify(existingTasks.map(t => ({ title: t.title, priority: t.priority, tags: t.tags })))}` : ''}

Respond EXACTLY with this JSON:
{
  "suggestedPriority": "low|medium|high",
  "suggestedEstimatedTime": 30,
  "suggestedTags": ["tag1", "tag2"],
  "reason": "Brief reason for these suggestions"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && parsed.suggestedPriority) return parsed
  return { suggestedPriority: 'medium', suggestedEstimatedTime: 30, suggestedTags: [], reason: '' }
}

async function generateAnalyticsInsights(tasks, habits, goals, opts = {}) {
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

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
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

async function generateHabitInsights(habits, tasks = [], goals = [], opts = {}) {
  const sysMsg = `You are FlowSync AI, a habit coach. Analyze habits and provide insights. Respond with valid JSON only. Write text in the user's language if detectable from habit/task titles.`
  const userMsg = `Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, frequency: h.frequency, streak: h.streak, logs: (h.logs || []).slice(-30) })))}
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })))}
Goals: ${JSON.stringify(goals.map(g => ({ title: g.title, progress: g.progress })))}

Respond EXACTLY with this JSON:
{
  "focusHabit": "title of the habit to focus on today",
  "focusReason": "brief reason why this habit matters today",
  "streakMessage": "motivational message based on their best streak",
  "optimalTime": "suggested best time of day for this habit",
  "pattern": "observed pattern or insight from their habit logs",
  "tip": "actionable tip to improve consistency"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && parsed.focusHabit) return parsed
  return {
    focusHabit: '',
    focusReason: '',
    streakMessage: 'Keep going! Every day counts.',
    optimalTime: '',
    pattern: '',
    tip: 'Try to check in at the same time each day to build consistency.',
  }
}

async function generateFocusSuggestion(tasks, focusTaskId, opts = {}) {
  const focusTask = tasks.find(t => t._id.toString() === focusTaskId) || tasks[0]
  const sysMsg = `You are FlowSync AI, a focus and productivity coach. Provide a personalized focus suggestion for the user's current task. Respond with valid JSON only.`
  const userMsg = `Current focus task: ${JSON.stringify({ title: focusTask?.title, priority: focusTask?.priority, deadline: focusTask?.deadline, status: focusTask?.status })}
Other tasks: ${JSON.stringify(tasks.filter(t => t._id?.toString() !== focusTaskId).slice(0, 10).map(t => ({ title: t.title, priority: t.priority, deadline: t.deadline })))}

Respond EXACTLY with this JSON:
{
  "title": "Short contextual title for the suggestion",
  "desc": "Personalized focus recommendation with specific time blocks",
  "breakSuggestion": "Specific break recommendation based on task complexity",
  "focusTime": 25,
  "energyRequired": "low|medium|high",
  "reason": "Why this approach works for this specific task"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && parsed.title) return parsed
  const p = focusTask?.priority || 'medium'
  return {
    title: p === 'high' ? 'High Priority Focus' : 'Steady Focus',
    desc: focusTask ? `Focus on "${focusTask.title}" with ${p === 'high' ? '25 min' : '20 min'} blocks.` : 'Select a task to get AI-powered focus suggestions.',
    breakSuggestion: p === 'high' ? 'Take 5-min breaks to maintain intensity' : 'Standard 7-min breaks recommended',
    focusTime: p === 'high' ? 25 : 20,
    energyRequired: p === 'high' ? 'high' : 'medium',
    reason: '',
  }
}

async function generateProfileInsights(tasks, habits, goals, opts = {}) {
  const sysMsg = `You are FlowSync AI, a personal productivity analyst. Generate a personalized productivity summary for the user's profile. Respond with valid JSON only.`
  const userMsg = `Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status, deadline: t.deadline })))}
Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, streak: h.streak, frequency: h.frequency })))}
Goals: ${JSON.stringify(goals.map(g => ({ title: g.title, status: g.status, progress: g.progress })))}

Respond EXACTLY with this JSON:
{
  "productivityScore": 0-100,
  "totalTasks": 0,
  "completedTasks": 0,
  "completionRate": 0,
  "streakDays": 0,
  "focusHours": 0,
  "topStrength": "string",
  "topWeakness": "string",
  "personalizedTip": "actionable tip based on their data",
  "dailyGoalRecommendation": "how many tasks they should aim for daily",
  "peakProductivityTime": "morning|afternoon|evening",
  "motivationalMessage": "short personalized motivational message"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && parsed.productivityScore !== undefined) return parsed
  const completed = tasks.filter(t => t.status === 'done').length
  const total = tasks.length || 1
  const maxStreak = Math.max(0, ...habits.map(h => h.streak || 0))
  return {
    productivityScore: Math.round((completed / total) * 100),
    totalTasks: tasks.length,
    completedTasks: completed,
    completionRate: Math.round((completed / total) * 100),
    streakDays: maxStreak,
    focusHours: 0,
    topStrength: 'Getting started',
    topWeakness: 'Track more to identify patterns',
    personalizedTip: 'Break your tasks into smaller chunks to maintain momentum.',
    dailyGoalRecommendation: '3-5 tasks per day for optimal productivity',
    peakProductivityTime: 'morning',
    motivationalMessage: 'Every small step counts toward your goals!',
  }
}

async function organizeNotifications(notifications, opts = {}) {
  const sysMsg = `You are FlowSync AI, a smart notification organizer. Group and prioritize notifications intelligently. Respond with valid JSON only.`
  const userMsg = `Notifications: ${JSON.stringify(notifications.map(n => ({ title: n.title, message: n.message, type: n.type, createdAt: n.createdAt })))}

Analyze these notifications and organize them. Respond EXACTLY with this JSON:
{
  "groups": [{ "name": "Urgent", "priority": 1, "notificationIds": [0, 1], "reason": "why grouped" }],
  "prioritizedIds": [0, 2, 1],
  "summary": "Brief summary of what needs attention"
}`

  const raw = await callAI(sysMsg, userMsg, 0.3, 1024, opts.quality)
  const parsed = parseJSON(raw)
  if (parsed && Array.isArray(parsed.groups)) return parsed
  return {
    groups: [{ name: 'All Notifications', priority: 1, notificationIds: notifications.map((_, i) => i), reason: 'Default grouping' }],
    prioritizedIds: notifications.map((_, i) => i),
    summary: `${notifications.length} notification(s)`,
  }
}

module.exports = {
  generatePlan,
  prioritizeTasks,
  rescueMode,
  chatWithContext,
  suggestTask,
  generateAnalyticsInsights,
  generateHabitInsights,
  generateFocusSuggestion,
  generateProfileInsights,
  organizeNotifications,
  resolveModels,
  MODEL_TIERS,
  dedupeHistory,
}
