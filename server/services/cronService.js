const cron = require('node-cron')
const Task = require('../models/Task')
const Notification = require('../models/Notification')

function startCronJobs() {
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Checking task deadlines...')
    try {
      const now = new Date()
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      const upcomingTasks = await Task.find({
        dueDate: { $gte: now, $lte: in24h },
        status: { $ne: 'completed' },
      }).populate('user')

      for (const task of upcomingTasks) {
        const existing = await Notification.findOne({
          user: task.user._id,
          'relatedTo.id': task._id,
          type: 'deadline_alert',
          createdAt: { $gte: now },
        })
        if (existing) continue

        await Notification.create({
          user: task.user._id,
          title: 'Upcoming Deadline',
          message: `"${task.title}" is due within the next 24 hours. Start working on it now.`,
          type: 'deadline_alert',
          relatedTo: { model: 'Task', id: task._id },
        })
      }

      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
      }).populate('user')

      for (const task of overdueTasks) {
        const existing = await Notification.findOne({
          user: task.user._id,
          'relatedTo.id': task._id,
          type: 'deadline_alert',
          message: { $regex: 'overdue' },
        })
        if (existing) continue

        await Notification.create({
          user: task.user._id,
          title: 'Overdue Task',
          message: `"${task.title}" is overdue. Consider reprioritizing or rescheduling.`,
          type: 'deadline_alert',
          relatedTo: { model: 'Task', id: task._id },
        })
      }

      if (upcomingTasks.length || overdueTasks.length) {
        console.log(`[Cron] Created ${upcomingTasks.length} upcoming + ${overdueTasks.length} overdue notifications`)
      }
    } catch (err) {
      console.error('[Cron] Error checking deadlines:', err.message)
    }
  })

  console.log('[Cron] Deadline checker scheduled (every hour)')
}

module.exports = { startCronJobs }
