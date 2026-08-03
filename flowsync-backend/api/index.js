const connectDB = require('../config/db')
const app = require('../app')
const { runReminderCheckIfDue } = require('../services/reminderService')

module.exports = async (req, res) => {
  try {
    await connectDB()
  } catch (err) {
    console.error('Database connection failed:', err.message)
    res.status(500).json({ message: 'Database connection failed' })
    return
  }

  res.on('finish', () => {
    runReminderCheckIfDue().catch((err) => console.error('Reminder sweep error:', err.message))
  })

  return app(req, res)
}
