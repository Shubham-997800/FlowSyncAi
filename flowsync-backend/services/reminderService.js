const Task = require('../models/Task')
const User = require('../models/User')
const Notification = require('../models/Notification')
const { sendResetEmail } = require('./emailService')

const CHECK_INTERVAL = 30 * 60 * 1000

let intervalId = null

function startReminderService() {
  if (intervalId) return
  console.log('Reminder service started')

  const check = async () => {
    try {
      const now = new Date()
      const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)

      const tasks = await Task.find({
        status: { $ne: 'done' },
        deadline: { $gte: now, $lte: in48h },
      }).populate('user', 'email name')

      for (const task of tasks) {
        if (!task.user || !task.user.email) continue
        const hoursLeft = Math.round((task.deadline - now) / (1000 * 60 * 60))
        const existing = await Notification.findOne({
          user: task.user._id,
          type: 'deadline_alert',
          title: { $regex: task.title, $options: 'i' },
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        })
        if (existing) continue

        await Notification.create({
          user: task.user._id,
          type: 'deadline_alert',
          title: `Deadline approaching: "${task.title}"`,
          message: `Due in ${hoursLeft > 24 ? `${Math.round(hoursLeft / 24)} days` : `${hoursLeft} hours`} (${new Date(task.deadline).toLocaleDateString()})`,
          link: '/tasks',
        })
      }
    } catch (err) {
      console.error('Reminder check error:', err.message)
    }
  }

  check()
  intervalId = setInterval(check, CHECK_INTERVAL)
}

function stopReminderService() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

module.exports = { startReminderService, stopReminderService }