const Task = require('../models/Task')
const aiService = require('../services/aiService')

const plan = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ message: 'Prompt required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generatePlan(prompt, tasks)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const prioritize = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.prioritizeTasks(tasks)
    for (const r of result.rankings) {
      if (r.taskId) {
        await Task.findByIdAndUpdate(r.taskId, { aiRiskScore: r.riskScore, aiSuggestedOrder: r.priorityScore })
      }
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const rescue = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' },
      deadline: { $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    }).sort({ deadline: 1 })
    const result = await aiService.rescueMode(tasks)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const chatAI = async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ message: 'Message required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.chat(message, tasks)
    if (result.tasks && result.tasks.length > 0) {
      const created = await Task.insertMany(
        result.tasks.map(t => ({ ...t, user: req.user._id }))
      )
      result.createdTasks = created
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { plan, prioritize, rescue, chatAI }
