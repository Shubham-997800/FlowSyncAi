const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const AiUsage = require('../models/AiUsage')
const aiService = require('../services/aiService')

const DAILY_LIMIT = 200

async function checkAiQuota(userId) {
  const today = new Date().toISOString().split('T')[0]
  const usage = await AiUsage.findOne({ user: userId, date: today })
  if (usage && usage.count >= DAILY_LIMIT) return false
  await AiUsage.findOneAndUpdate(
    { user: userId, date: today },
    { $inc: { count: 1 } },
    { upsert: true }
  )
  return true
}

const plan = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ message: 'Prompt required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generatePlan(prompt, tasks)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') {
      return res.status(503).json({ message: 'AI service is currently unavailable due to quota limits. Please try again later.', reply: "I'm currently unavailable due to API limits. Try again later.", tasks: [], suggestions: [] })
    }
    res.status(500).json({ message: error.message })
  }
}

const prioritize = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.prioritizeTasks(tasks)
    for (const r of result.rankings) {
      if (r.taskId) {
        await Task.findByIdAndUpdate(r.taskId, { aiRiskScore: r.riskScore, aiSuggestedOrder: r.priorityScore })
      }
    }
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ message: 'AI service quota exceeded' })
    res.status(500).json({ message: error.message })
  }
}

const rescue = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' },
      deadline: { $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    }).sort({ deadline: 1 })
    const result = await aiService.rescueMode(tasks)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ message: 'AI service quota exceeded' })
    res.status(500).json({ message: error.message })
  }
}

const chatAI = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { message } = req.body
    if (!message) return res.status(400).json({ message: 'Message required' })
    const [tasks, goals, habits] = await Promise.all([
      Task.find({ user: req.user._id, status: { $ne: 'done' } }),
      Goal.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
    ])
    const result = await aiService.chatWithContext(message, tasks, goals, habits)
    if (result.tasks && result.tasks.length > 0) {
      const created = await Task.insertMany(
        result.tasks.map(t => ({ ...t, user: req.user._id }))
      )
      result.createdTasks = created
    }
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ reply: "AI service is currently unavailable due to quota limits. Please try again later or upgrade your API plan.", tasks: [], suggestions: [] })
    res.status(500).json({ message: error.message })
  }
}

const suggestTaskAI = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const { title, description } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const existingTasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)
    const result = await aiService.suggestTask(title, description, existingTasks)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ message: 'AI service unavailable', suggestedPriority: 'medium', suggestedEstimatedTime: 30, suggestedTags: [], reason: '' })
    res.status(500).json({ message: error.message })
  }
}

const getUsage = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const usage = await AiUsage.findOne({ user: req.user._id, date: today })
    res.json({ used: usage?.count || 0, limit: DAILY_LIMIT })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const analyticsInsights = async (req, res) => {
  try {
    if (!(await checkAiQuota(req.user._id))) return res.status(429).json({ message: `Daily AI limit (${DAILY_LIMIT}) reached. Try again tomorrow.` })
    const [tasks, habits, goals] = await Promise.all([
      Task.find({ user: req.user._id }),
      Habit.find({ user: req.user._id }),
      Goal.find({ user: req.user._id }),
    ])
    const result = await aiService.generateAnalyticsInsights(tasks, habits, goals)
    res.json(result)
  } catch (error) {
    if (error.message === 'AI_SERVICE_UNAVAILABLE') return res.status(503).json({ message: 'AI service unavailable' })
    res.status(500).json({ message: error.message })
  }
}

module.exports = { plan, prioritize, rescue, chatAI, suggestTaskAI, getUsage, analyticsInsights }
