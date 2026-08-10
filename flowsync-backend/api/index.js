const connectDB = require('../config/db')
const app = require('../app')
const { runReminderCheckIfDue } = require('../services/reminderService')

function isCronAuthorized(req) {
  if (req.headers['x-vercel-cron']) return true
  if (!process.env.CRON_SECRET) return false
  return req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`
}

async function handleCron(req, res) {
  if (!isCronAuthorized(req)) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    await runReminderCheckIfDue()
    res.json({ ok: true, message: 'Reminder sweep complete' })
  } catch (err) {
    console.error('Cron reminder sweep error:', err.message)
    res.status(500).json({ message: 'Reminder sweep failed' })
  }
}

module.exports = async (req, res) => {
  try {
    await connectDB()
  } catch (err) {
    console.error('Database connection failed:', err.message)
    res.status(500).json({ message: 'Database connection failed' })
    return
  }

  const url = new URL(req.url, 'http://localhost')
  if (url.pathname.startsWith('/api/cron/')) {
    return handleCron(req, res)
  }

  // Versioned alias: /api/v1/<route> serves the same handlers as /api/<route>.
  if (url.pathname.startsWith('/api/v1/')) {
    req.url = req.url.replace(/^\/api\/v1/, '/api')
  }

  res.on('finish', () => {
    runReminderCheckIfDue().catch((err) => console.error('Reminder sweep error:', err.message))
  })

  return app(req, res)
}
