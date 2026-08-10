const Task = require('../models/Task')
const Notification = require('../models/Notification')
const ReminderState = require('../models/ReminderState')
const { sendPushToUser } = require('../controllers/pushController')
const { sendEmail } = require('./mailer')

const { REMINDER_CHECK_INTERVAL } = require('../config/constants')

const SWEEP_KEY = 'reminderSweep'

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let intervalId = null

async function checkReminders() {
  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  const tasks = await Task.find({
    status: { $ne: 'done' },
    deadline: { $gte: now, $lte: in48h },
  }).populate('user', 'email name notificationPrefs')

  for (const task of tasks) {
    if (!task.user || !task.user.email) continue
    const hoursLeft = Math.round((task.deadline - now) / (1000 * 60 * 60))
    const existing = await Notification.findOne({
      user: task.user._id,
      type: 'deadline_alert',
      title: { $regex: escapeRegex(task.title), $options: 'i' },
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
    if (task.user.notificationPrefs?.email !== false) {
      const dueText = hoursLeft > 24 ? `${Math.round(hoursLeft / 24)} days` : `${hoursLeft} hours`
      const appUrl = process.env.CLIENT_URL || 'https://flowsyncai30.vercel.app'
      sendEmail({
        to: task.user.email,
        subject: `Deadline approaching: "${task.title}"`,
        text: `Hi ${task.user.name || 'there'},\n\n"${task.title}" is due in ${dueText} (${new Date(task.deadline).toLocaleDateString()}).\n\nLog in to FlowSync AI to plan your time: ${appUrl}/tasks`,
        html: `<p>Hi ${task.user.name || 'there'},</p><p><strong>"${task.title}"</strong> is due in ${dueText} (${new Date(task.deadline).toLocaleDateString()}).</p><p><a href="${appUrl}/tasks">Open FlowSync AI</a> to plan your time.</p>`,
      }).catch((err) => console.error('Reminder email error:', err.message))
    }
  }
}

async function runReminderCheckIfDue() {
  const now = new Date()
  const cutoff = new Date(now.getTime() - REMINDER_CHECK_INTERVAL)

  try {
    const claim = await ReminderState.findOneAndUpdate(
      { key: SWEEP_KEY, $or: [{ lastRun: null }, { lastRun: { $lte: cutoff } }] },
      { $set: { lastRun: now } },
      { upsert: true, returnDocument: 'after' }
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
