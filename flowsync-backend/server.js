const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes = require('./routes/aiRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const goalRoutes = require('./routes/goalRoutes')
const habitRoutes = require('./routes/habitRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const pushRoutes = require('./routes/pushRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { startReminderService } = require('./services/reminderService')

dotenv.config()
connectDB()

const required = ['MONGODB_URI', 'JWT_SECRET']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`)
    process.exit(1)
  }
}
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('WARNING: JWT_SECRET is too short. Use a 256-bit (64 character hex) random string.')
}

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }))
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'FlowSync AI API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/chat', chatRoutes)

app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message).join(', ')
    return res.status(400).json({ message: msgs })
  }
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate field' })
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' })
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`FlowSync AI server running on port ${PORT}`)
  startReminderService()
})

