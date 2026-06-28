const Analytics = require('../models/Analytics')
const Task = require('../models/Task')
const FocusSession = require('../models/FocusSession')

const getAnalytics = async (req, res, next) => {
  try {
    let analytics = await Analytics.findOne({ user: req.user._id })
    if (!analytics) {
      analytics = await Analytics.create({ user: req.user._id })
    }
    res.json(analytics)
  } catch (error) {
    next(error)
  }
}

const getWeeklyReport = async (req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: weekAgo } })
    const focusSessions = await FocusSession.find({ user: req.user._id, date: { $gte: weekAgo } })

    const completed = tasks.filter(t => t.status === 'completed').length
    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0)

    res.json({
      tasksCompleted: completed,
      totalTasks: tasks.length,
      focusMinutes: totalFocusMinutes,
      productivityScore: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAnalytics, getWeeklyReport }
