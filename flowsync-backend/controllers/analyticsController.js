const Task = require('../models/Task')

const getWeekly = async (req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: weekAgo } })

    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const overdue = await Task.countDocuments({ user: req.user._id, deadline: { $lt: new Date() }, status: { $ne: 'done' } })

    const daily = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999)
      d.setHours(0, 0, 0, 0)
      const dayTasks = tasks.filter(t => new Date(t.createdAt) >= d && new Date(t.createdAt) <= dayEnd)
      daily.push({ date: d.toISOString().split('T')[0], total: dayTasks.length, completed: dayTasks.filter(t => t.status === 'done').length })
    }

    res.json({
      totalTasks: total, completedTasks: done, overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
      dailyBreakdown: daily,
    })
  } catch (error) { next(error) }
}

const getMonthly = async (req, res, next) => {
  try {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: start, $lte: end } })

    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const high = tasks.filter(t => t.priority === 'high').length
    const highDone = tasks.filter(t => t.priority === 'high' && t.status === 'done').length

    const weekly = []
    for (let w = 0; w < 4; w++) {
      const ws = new Date(start); ws.setDate(ws.getDate() + w * 7)
      const we = new Date(ws); we.setDate(ws.getDate() + 7)
      const wt = tasks.filter(t => new Date(t.createdAt) >= ws && new Date(t.createdAt) < we)
      weekly.push({ week: w + 1, total: wt.length, completed: wt.filter(t => t.status === 'done').length })
    }

    res.json({
      totalTasks: total, completedTasks: done, completionRate: total ? Math.round((done / total) * 100) : 0,
      highPriorityTasks: high, highPriorityCompleted: highDone,
      highPriorityRate: high ? Math.round((highDone / high) * 100) : 0,
      weeklyBreakdown: weekly,
    })
  } catch (error) { next(error) }
}

const getStats = async (req, res, next) => {
  try {
    const all = await Task.find({ user: req.user._id })
    const total = all.length
    res.json({
      total,
      todo: all.filter(t => t.status === 'todo').length,
      inProgress: all.filter(t => t.status === 'in_progress').length,
      done: all.filter(t => t.status === 'done').length,
      byPriority: {
        high: all.filter(t => t.priority === 'high').length,
        medium: all.filter(t => t.priority === 'medium').length,
        low: all.filter(t => t.priority === 'low').length,
      },
      overdue: all.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length,
      completionRate: total ? Math.round((all.filter(t => t.status === 'done').length / total) * 100) : 0,
    })
  } catch (error) { next(error) }
}

module.exports = { getWeekly, getMonthly, getStats }
