const Task = require('../models/Task')
const aiService = require('../services/aiService')

const plan = async (req, res, next) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ message: 'Prompt required' })
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.generatePlan(prompt, tasks)
    res.json(result)
  } catch (error) { next(error) }
}

const prioritize = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } })
    const result = await aiService.prioritizeTasks(tasks)
    for (const r of result.rankings) {
      if (r.taskId) {
        await Task.findByIdAndUpdate(r.taskId, { aiRiskScore: r.riskScore, aiSuggestedOrder: r.priorityScore })
      }
    }
    res.json(result)
  } catch (error) { next(error) }
}

const rescue = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' },
      deadline: { $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    }).sort({ deadline: 1 })
    const result = await aiService.rescueMode(tasks)
    res.json(result)
  } catch (error) { next(error) }
}

module.exports = { plan, prioritize, rescue }
