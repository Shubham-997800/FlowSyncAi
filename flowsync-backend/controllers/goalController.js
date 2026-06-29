const Goal = require('../models/Goal')

const allowedFields = ['title', 'description', 'targetDate', 'status', 'progress']

function sanitize(body) {
  const safe = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) safe[key] = body[key]
  }
  return safe
}

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(goals)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(goal)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    res.status(500).json({ message: error.message })
  }
}

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitize(req.body),
      { new: true, runValidators: true }
    )
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    res.json(goal)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    res.status(500).json({ message: error.message })
  }
}

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    res.json({ message: 'Goal deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getGoals, createGoal, updateGoal, deleteGoal }
