const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const AiUsage = require('../models/AiUsage')
const ChatMessage = require('../models/ChatMessage')
const mongoose = require('mongoose')
const aiService = require('../services/aiService')
const { handleError } = require('../utils/errorHandler')
const { localDateKey } = require('../utils/dateKey')
const { AI_DAILY_LIMIT } = require('../config/constants')

const userQuality = req => (req.user?.aiSettings?.quality || 'medium')

async function canUseAi(userId) {
  const today = localDateKey()
  const usage = await AiUsage.findOne({ user: userId, date: today })
  return !(usage && usage.count >= AI_DAILY_LIMIT)
}

async function recordAiUsage(userId) {
  const today = localDateKey()
  await AiUsage.findOneAndUpdate(
    { user: userId, date: today },
    { $inc: { count: 1 } },
    { upsert: true }
  )
}

const plan = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ message: 'Prompt required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generatePlan(prompt, tasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') {
      return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service is currently unavailable due to quota limits. Please try again later.', reply: "I'm currently unavailable due to API limits. Try again later.", tasks: [], suggestions: [] })
    }
    handleError(res, error)
  }
}

const prioritize = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
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
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service quota exceeded' })
    handleError(res, error)
  }
}

const rescue = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' },
      deadline: { $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    }).sort({ deadline: 1 })
    const result = await aiService.rescueMode(tasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service quota exceeded' })
    handleError(res, error)
  }
}

const chatAI = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { message, sessionId } = req.body
    if (!message) return res.status(400).json({ message: 'Message required' })
    const [tasks, goals, habits] = await Promise.all([
      Task.find({ user: req.user._id, status: { $ne: 'done' } }),
      Goal.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
    ])
    let history = []
    if (sessionId) {
      history = (await ChatMessage.find({ user: req.user._id, sessionId })
        .sort({ createdAt: -1 })
        .limit(8)).reverse()
    }
    const result = await aiService.chatWithContext(message, tasks, goals, habits, { quality: userQuality(req), history })
    if (result.tasks && result.tasks.length > 0) {
      const created = await Task.insertMany(
        result.tasks.map(t => ({ ...t, user: req.user._id }))
      )
      result.createdTasks = created
    }
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', reply: "AI service is currently unavailable due to quota limits. Please try again later or upgrade your API plan.", tasks: [], suggestions: [] })
    handleError(res, error)
  }
}

const suggestTaskAI = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { title, description } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const existingTasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)
    const result = await aiService.suggestTask(title, description, existingTasks, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable', suggestedPriority: 'medium', suggestedEstimatedTime: 30, suggestedTags: [], reason: '' })
    handleError(res, error)
  }
}

const getUsage = async (req, res) => {
  try {
    const today = localDateKey()
    const usage = await AiUsage.findOne({ user: req.user._id, date: today })
    res.json({ used: usage?.count || 0, limit: AI_DAILY_LIMIT })
  } catch (error) {
    handleError(res, error)
  }
}

const analyticsInsights = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const [tasks, habits, goals] = await Promise.all([
      Task.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
      Goal.find({ user: req.user._id }),
    ])
    const result = await aiService.generateAnalyticsInsights(tasks, habits, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable' })
    handleError(res, error)
  }
}

const habitInsights = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached. Try again tomorrow.` })
    const [habits, tasks, goals] = await Promise.all([
      Habit.find({ user: req.user._id }),
      Task.find({ user: req.user._id }).limit(10),
      Goal.find({ user: req.user._id }).limit(5),
    ])
    const result = await aiService.generateHabitInsights(habits, tasks, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable' })
    handleError(res, error)
  }
}

const focusSuggestion = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached.` })
    const { taskId } = req.body
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generateFocusSuggestion(tasks, taskId, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable' })
    handleError(res, error)
  }
}

const profileInsights = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached.` })
    const [tasks, habits, goals] = await Promise.all([
      Task.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
      Goal.find({ user: req.user._id }),
    ])
    const result = await aiService.generateProfileInsights(tasks, habits, goals, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable' })
    handleError(res, error)
  }
}

const organizeNotifications = async (req, res) => {
  try {
    if (!(await canUseAi(req.user._id))) return res.status(429).json({ code: 'AI_DAILY_LIMIT', message: `Daily AI limit (${AI_DAILY_LIMIT}) reached.` })
    const { notifications } = req.body
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.json({ groups: [], prioritizedIds: [], summary: 'No notifications to organize' })
    }
    const result = await aiService.organizeNotifications(notifications, { quality: userQuality(req) })
    await recordAiUsage(req.user._id)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ code: 'AI_SERVICE_UNAVAILABLE', message: 'AI service unavailable' })
    handleError(res, error)
  }
}

module.exports = { plan, prioritize, rescue, chatAI, suggestTaskAI, getUsage, analyticsInsights, habitInsights, focusSuggestion, profileInsights, organizeNotifications }
