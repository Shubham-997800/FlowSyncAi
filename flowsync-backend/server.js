const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
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

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

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

// TEMP: Cleanup old users
const User = require('./models/User')
const Task = require('./models/Task')
const Goal = require('./models/Goal')
const Habit = require('./models/Habit')

app.post('/api/cleanup', async (req, res) => {
  try {
    if (req.body.secret !== process.env.JWT_SECRET) return res.status(401).json({ message: 'Unauthorized' })
    const users = await User.find({ email: { $ne: 'shubhamdangi82@gmail.com' } })
    let deleted = 0
    for (const u of users) {
      await Task.deleteMany({ user: u._id })
      await Goal.deleteMany({ user: u._id })
      await Habit.deleteMany({ user: u._id })
      await u.deleteOne()
      deleted++
    }
    const remain = await User.countDocuments()
    const t = await Task.countDocuments()
    const g = await Goal.countDocuments()
    const h = await Habit.countDocuments()
    res.json({ deleted, remaining: remain, tasks: t, goals: g, habits: h })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

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
})

