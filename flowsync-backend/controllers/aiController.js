const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const AiUsage = require('../models/AiUsage')
const ChatMessage = require('../models/ChatMessage')
const mongoose = require('mongoose')
const aiService = require('../services/aiService')
const { AiServiceUnavailableError } = require('../utils/errors')
const { handleError, handleValidationError } = require('../utils/errorHandler')
const { localDateKey } = require('../utils/dateKey')
const { AI_DAILY_LIMIT, AI_MONTHLY_LIMIT } = require('../config/constants')

const MAX_MESSAGE_LEN = 2000
const AI_UNAVAILABLE_MESSAGE = 'The AI service is temporarily busy due to provider limits. Please try again in a few minutes.'

const userQuality = req => (req.user?.aiSettings?.quality || 'medium')

function requestQuality(req) {
  const q = req.body?.quality
  return q && ['low', 'medium', 'high'].includes(q) ? q : userQuality(req)
}

const CHAT_CONTEXT_MESSAGES = aiService.CHAT_CONTEXT_MESSAGES || 12

async function getAiUsageCount(userId) {
  const today = localDateKey()
  const usage = await AiUsage.findOne({ user: userId, date: today })
  return usage?.count || 0
}

function localMonthKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

async function getAiMonthUsageCount(userId) {
  const prefix = localMonthKey()
  const agg = await AiUsage.aggregate([
    { $match: { user: userId, date: { $gte: `${prefix}-01`, $lte: `${prefix}-99` } } },
    { $group: { _id: null, total: { $sum: '$count' } } },
  ])
  return agg[0]?.total || 0
}

async function canUseAi(userId) {
  const daily = await getAiUsageCount(userId)
  if (daily >= AI_DAILY_LIMIT) return { ok: false, reason: 'daily', used: daily, monthlyUsed: 0 }
  const monthlyUsed = await getAiMonthUsageCount(userId)
  if (monthlyUsed >= AI_MONTHLY_LIMIT) return { ok: false, reason: 'monthly', used: daily, monthlyUsed }
  return { ok: true, used: daily, monthlyUsed }
}

async function recordAiUsage(userId) {
  const today = localDateKey()
  await AiUsage.findOneAndUpdate(
    { user: userId, date: today },
    { $inc: { count: 1 } },
    { upsert: true }
  )
}

function nextResetDate() {
  const now = new Date()
  const reset = new Date(now)
  reset.setHours(24, 0, 0, 0)
  return reset
}

async function limitReachedResponse(res, userId, check = {}) {
  const used = check.used ?? (await getAiUsageCount(userId))
  const monthlyUsed = check.monthlyUsed ?? (await getAiMonthUsageCount(userId))
  if (check.reason === 'monthly') {
    return res.status(429).json({
      code: 'AI_MONTHLY_LIMIT',
      message: `You've reached the monthly limit of ${AI_MONTHLY_LIMIT} AI messages. The limit resets at the start of next month.`,
      used: monthlyUsed,
      limit: AI_MONTHLY_LIMIT,
      period: 'monthly',
    })
  }
  const reset = nextResetDate()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your timezone'
  const time = reset.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return res.status(429).json({
    code: 'AI_DAILY_LIMIT',
    message: `You've used all ${AI_DAILY_LIMIT} AI messages for today. Your limit resets at ${time} (${tz}).`,
    used,
    limit: AI_DAILY_LIMIT,
    resetsAt: reset.toISOString(),
  })
}

function sanitizeAiTask(t = {}) {
  const title = typeof t.title === 'string' ? t.title.trim().slice(0, 200) : ''
  if (!title) return null
  const priority = ['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium'
  let deadline = null
  if (t.deadline) { const d = new Date(t.deadline); if (!Number.isNaN(d.getTime())) deadline = d }
  const description = typeof t.description === 'string' ? t.description.trim().slice(0, 2000) : ''
  return { title, description, priority, deadline }
}

async function createTasksFromAI(userId, tasks = []) {
  const clean = (Array.isArray(tasks) ? tasks : []).map(sanitizeAiTask).filter(Boolean)
  if (clean.length === 0) return []
  return Task.insertMany(clean.map(t => ({ ...t, user: userId })))
}

const plan = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ message: 'Prompt required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generatePlan(prompt, tasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) {
      return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE, reply: "I'm currently unavailable due to API limits. Try again in a few minutes.", tasks: [], suggestions: [] })
    }
    handleError(res, error)
  }
}

const prioritize = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.prioritizeTasks(tasks, { quality: userQuality(req) })
    for (const r of result.rankings) {
      if (r.taskId && mongoose.isValidObjectId(r.taskId)) {
        await Task.updateOne(
          { _id: r.taskId, user: req.user._id },
          { aiRiskScore: r.riskScore, aiSuggestedOrder: r.priorityScore }
        )
      }
    }
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const rescue = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' },
      deadline: { $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    }).sort({ deadline: 1 })
    const result = await aiService.rescueMode(tasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const chatAI = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { message, sessionId, mode } = req.body
    if (!message) return res.status(400).json({ message: 'Message required' })
    if (String(message).length > MAX_MESSAGE_LEN) return res.status(400).json({ message: `Message too long (max ${MAX_MESSAGE_LEN} characters)` })
    const [tasks, goals, habits] = await Promise.all([
      Task.find({ user: req.user._id, status: { $ne: 'done' } }),
      Goal.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
    ])
    let history = []
    if (sessionId) {
      history = (await ChatMessage.find({ user: req.user._id, sessionId })
        .sort({ createdAt: -1 })
        .limit(CHAT_CONTEXT_MESSAGES)).reverse()
    }
    const result = await aiService.chatWithContext(message, tasks, goals, habits, { quality: requestQuality(req), history, mode })
    if (result.tasks && result.tasks.length > 0) {
      const created = await createTasksFromAI(req.user._id, result.tasks)
      result.createdTasks = created
    }
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE, reply: "I'm currently unavailable due to API limits. Try again in a few minutes.", tasks: [], suggestions: [] })
    if (error.name === 'ValidationError') return handleValidationError(res, error)
    handleError(res, error)
  }
}

const executeChatActions = async (userId, actions = []) => {
  const results = []
  for (const a of actions.slice(0, 10)) {
    const id = a?.taskId
    if (!id || !mongoose.isValidObjectId(id)) {
      results.push({ taskId: id, ok: false, error: 'invalid task id' })
      continue
    }
    try {
      if (['complete', 'in_progress', 'pending'].includes(a.action)) {
        const status = a.action === 'complete' ? 'done' : a.action === 'in_progress' ? 'in_progress' : 'todo'
        const task = await Task.findOneAndUpdate({ _id: id, user: userId }, { status }, { new: true })
        if (!task) { results.push({ taskId: id, ok: false, error: 'task not found' }); continue }
        results.push({ taskId: id, ok: true, action: a.action, title: task.title, status: task.status })
      } else if (a.action === 'delete') {
        const task = await Task.findOneAndDelete({ _id: id, user: userId })
        if (!task) { results.push({ taskId: id, ok: false, error: 'task not found' }); continue }
        results.push({ taskId: id, ok: true, action: 'delete', title: task.title })
      } else if (a.action === 'update') {
        const patch = {}
        if (typeof a.title === 'string' && a.title.trim()) patch.title = require('../utils/sanitize').sanitizeText(a.title.trim())
        if (['low', 'medium', 'high'].includes(a.priority)) patch.priority = a.priority
        if (a.deadline) { const d = new Date(a.deadline); if (!Number.isNaN(d.getTime())) patch.deadline = d }
        const task = await Task.findOneAndUpdate({ _id: id, user: userId }, { $set: patch }, { new: true })
        if (!task) { results.push({ taskId: id, ok: false, error: 'task not found' }); continue }
        results.push({ taskId: id, ok: true, action: 'update', title: task.title })
      } else {
        results.push({ taskId: id, ok: false, error: 'unknown action' })
      }
    } catch (error) {
      results.push({ taskId: id, ok: false, error: error.message })
    }
  }
  return results
}

const chatStream = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { message, sessionId, mode } = req.body
    if (!message) return res.status(400).json({ message: 'Message required' })
    if (String(message).length > MAX_MESSAGE_LEN) return res.status(400).json({ message: `Message too long (max ${MAX_MESSAGE_LEN} characters)` })
    const [tasks, goals, habits] = await Promise.all([
      Task.find({ user: req.user._id, status: { $ne: 'done' } }).limit(60),
      Goal.find({ user: req.user._id }).limit(20),
      Habit.find({ user: req.user._id }).limit(20),
    ])
    let history = []
    if (sessionId) {
      history = (await ChatMessage.find({ user: req.user._id, sessionId })
        .sort({ createdAt: -1 })
        .limit(CHAT_CONTEXT_MESSAGES)).reverse()
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders()

    const send = (obj) => { try { res.write(`data: ${JSON.stringify(obj)}\n\n`) } catch {} }
    send({ event: 'start' })

    try {
      const onReplyToken = (token) => send({ token })
      const result = await aiService.chatStreamWithContext(
        message, tasks, goals, habits,
        { quality: requestQuality(req), history, mode },
        onReplyToken,
      )
      const actionResults = await executeChatActions(req.user._id, result.actions)
      let createdTasks = []
      if (result.tasks && result.tasks.length > 0) {
        createdTasks = await createTasksFromAI(req.user._id, result.tasks)
      }
      await recordAiUsage(req.user._id)
      send({
        done: true,
        reply: result.reply,
        tasks: result.tasks || [],
        createdTasks: createdTasks.map(ct => ({ _id: ct._id, title: ct.title, priority: ct.priority, deadline: ct.deadline, status: ct.status })),
        actions: actionResults,
        suggestions: result.suggestions || [],
      })
      res.end()
    } catch (error) {
      if (error instanceof AiServiceUnavailableError) {
        send({ error: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
      } else {
        console.error('Chat stream error:', error.message)
        send({ error: 'SERVER_ERROR', message: 'Something went wrong while generating a reply. Please try again.' })
      }
      res.end()
    }
  } catch (error) {
    if (!res.headersSent) return handleError(res, error)
    res.end()
  }
}

const suggestTaskAI = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { title, description } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const existingTasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)
    const result = await aiService.suggestTask(title, description, existingTasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE, suggestedPriority: 'medium', suggestedEstimatedTime: 30, suggestedTags: [], reason: '' })
    handleError(res, error)
  }
}

const getUsage = async (req, res) => {
  try {
    const today = localDateKey()
    const [usage, monthlyUsed] = await Promise.all([
      AiUsage.findOne({ user: req.user._id, date: today }),
      getAiMonthUsageCount(req.user._id),
    ])
    res.json({ used: usage?.count || 0, limit: AI_DAILY_LIMIT, monthlyUsed, monthlyLimit: AI_MONTHLY_LIMIT })
  } catch (error) {
    handleError(res, error)
  }
}

const analyticsInsights = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const [tasks, habits, goals] = await Promise.all([
      Task.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
      Goal.find({ user: req.user._id }),
    ])
    const result = await aiService.generateAnalyticsInsights(tasks, habits, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const habitInsights = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const [habits, tasks, goals] = await Promise.all([
      Habit.find({ user: req.user._id }),
      Task.find({ user: req.user._id }).limit(10),
      Goal.find({ user: req.user._id }).limit(5),
    ])
    const result = await aiService.generateHabitInsights(habits, tasks, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const focusSuggestion = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { taskId } = req.body
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generateFocusSuggestion(tasks, taskId, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const profileInsights = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const [tasks, habits, goals] = await Promise.all([
      Task.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
      Goal.find({ user: req.user._id }),
    ])
    const result = await aiService.generateProfileInsights(tasks, habits, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

const organizeNotifications = async (req, res) => {
  try {
    const aiCheck = await canUseAi(req.user._id); if (!aiCheck.ok) return limitReachedResponse(res, req.user._id, aiCheck)
    const { notifications } = req.body
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.json({ groups: [], prioritizedIds: [], summary: 'No notifications to organize' })
    }
    const result = await aiService.organizeNotifications(notifications, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error instanceof AiServiceUnavailableError) return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: AI_UNAVAILABLE_MESSAGE })
    handleError(res, error)
  }
}

module.exports = { plan, prioritize, rescue, chatAI, chatStream, suggestTaskAI, getUsage, analyticsInsights, habitInsights, focusSuggestion, profileInsights, organizeNotifications }
