const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
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
const { requestId } = require('./middleware/requestId')

const app = express()

app.set('trust proxy', 1)
app.use(requestId)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:5173', 'https://openrouter.ai'],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }))
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }))
morgan.token('req-id', (req) => req.id)
app.use(morgan(process.env.NODE_ENV === 'production' ? ':req-id :remote-addr :method :url :status :res[content-length] - :response-time ms' : ':req-id :method :url :status :response-time ms'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'FlowSync AI API is running' })
})

app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose')
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const mongoState = dbStates[mongoose.connection.readyState] || 'unknown'
  res.status(mongoState === 'connected' ? 200 : 503).json({
    status: mongoState === 'connected' ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '3.1.1',
    database: mongoState,
    environment: process.env.NODE_ENV || 'development',
  })
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
  const log = { id: req.id, method: req.method, url: req.originalUrl, error: err.message, name: err.name }
  if (err.stack) log.stack = err.stack.split('\n').slice(0, 3).join(' ')
  if (process.env.NODE_ENV === 'production') console.error(JSON.stringify(log))
  else console.error(log)
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message).join(', ')
    return res.status(400).json({ message: msgs })
  }
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate field' })
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' })
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ message: statusCode >= 500 ? 'Server error' : (err.message || 'Server error') })
})

module.exports = app
