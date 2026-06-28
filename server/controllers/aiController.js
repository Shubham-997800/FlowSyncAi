const { prioritizeTask, suggestSchedule } = require('../services/geminiService')

const prioritize = async (req, res, next) => {
  try {
    const result = await prioritizeTask(req.body)
    res.json({ suggestion: result })
  } catch (error) {
    next(error)
  }
}

const schedule = async (req, res, next) => {
  try {
    const result = await suggestSchedule(req.body)
    res.json({ suggestion: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { prioritize, schedule }
