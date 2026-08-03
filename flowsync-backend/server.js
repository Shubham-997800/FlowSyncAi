require('dotenv').config()

const required = ['MONGODB_URI', 'JWT_SECRET']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`)
    process.exit(1)
  }
}
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET is too short. Use a 256-bit (64+ character hex) random string.')
  process.exit(1)
}

const connectDB = require('./config/db')
const app = require('./app')
const { startReminderService } = require('./services/reminderService')

const PORT = process.env.PORT || 5000

connectDB()

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err)
})

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  process.exit(1)
})

app.listen(PORT, () => {
  console.log(`FlowSync AI server running on port ${PORT}`)
  startReminderService()
})
