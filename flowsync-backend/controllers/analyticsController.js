const Task = require('../models/Task')

const { handleError } = require('../utils/errorHandler')
const { localDateKey } = require('../utils/dateKey')
const getWeekly = async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: weekAgo } }).select('status deadline createdAt').lean()

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
      daily.push({ date: localDateKey(d), total: dayTasks.length, completed: dayTasks.filter(t => t.status === 'done').length })
    }

    res.json({
      totalTasks: total, completedTasks: done, overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
      dailyBreakdown: daily,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getMonthly = async (req, res) => {
  try {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: start, $lte: end } }).select('status priority createdAt').lean()

    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const high = tasks.filter(t => t.priority === 'high').length
    const highDone = tasks.filter(t => t.priority === 'high' && t.status === 'done').length

    const weekly = []
    const daysInMonth = end.getDate()
    const weeks = Math.ceil(daysInMonth / 7)
    for (let w = 0; w < weeks; w++) {
      const ws = new Date(start); ws.setDate(ws.getDate() + w * 7)
      const we = new Date(ws); we.setDate(we.getDate() + 7)
      const wt = tasks.filter(t => new Date(t.createdAt) >= ws && new Date(t.createdAt) < we)
      weekly.push({ week: w + 1, total: wt.length, completed: wt.filter(t => t.status === 'done').length })
    }

    res.json({
      totalTasks: total, completedTasks: done, completionRate: total ? Math.round((done / total) * 100) : 0,
      highPriorityTasks: high, highPriorityCompleted: highDone,
      highPriorityRate: high ? Math.round((highDone / high) * 100) : 0,
      weeklyBreakdown: weekly,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getStats = async (req, res) => {
  try {
    // Aggregated in MongoDB so memory usage stays constant regardless of
    // how many tasks the user has (never loads full documents into Node).
    const [agg] = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$deadline', null] }, { $lt: ['$deadline', new Date()] }, { $ne: ['$status', 'done'] }] },
                1, 0,
              ],
            },
          },
        },
      },
    ])
    const total = agg?.total || 0
    const done = agg?.done || 0
    res.json({
      total,
      todo: agg?.todo || 0,
      inProgress: agg?.inProgress || 0,
      done,
      byPriority: { high: agg?.high || 0, medium: agg?.medium || 0, low: agg?.low || 0 },
      overdue: agg?.overdue || 0,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getWeekly, getMonthly, getStats }
