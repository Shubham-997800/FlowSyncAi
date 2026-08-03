const Task = require('../models/Task')
const Notification = require('../models/Notification')
const ReminderState = require('../models/ReminderState')
const { sendPushToUser } = require('../controllers/pushController')

const { REMINDER_CHECK_INTERVAL } = require('../config/constants')

const SWEEP_KEY = 'reminderSweep'

let intervalId = null

async function checkReminders() {
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
    await sendPushToUser(task.user._id, {
      title: `Deadline approaching: "${task.title}"`,
      body: `Due in ${hoursLeft > 24 ? `${Math.round(hoursLeft / 24)} days` : `${hoursLeft} hours`}`,
      url: '/tasks',
    })
  }
}

async function runReminderCheckIfDue() {
  const now = new Date()
  const cutoff = new Date(now.getTime() - REMINDER_CHECK_INTERVAL)

  try {
    const claim = await ReminderState.findOneAndUpdate(
      { key: SWEEP_KEY, $or: [{ lastRun: null }, { lastRun: { $lte: cutoff } }] },
      { $set: { lastRun: now } },
      { upsert: true, new: true }
    )
    if (!claim) return false
  } catch (err) {
    if (err.code !== 11000) {
      console.error('Reminder sweep claim error:', err.message)
      return false
    }
    return false
  }

  try {
    await checkReminders()
    return true
  } catch (err) {
    console.error('Reminder check error:', err.message)
    return false
  }
}

function startReminderService() {
  if (intervalId) return
  console.log('Reminder service started')

  runReminderCheckIfDue()
  intervalId = setInterval(runReminderCheckIfDue, REMINDER_CHECK_INTERVAL)
}

module.exports = { startReminderService, runReminderCheckIfDue }
