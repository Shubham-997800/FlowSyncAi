const Goal = require('../models/Goal')

const { handleError, handleValidationError } = require('../utils/errorHandler')
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
    handleError(res, error)
  }
}

const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(goal)
  } catch (error) {
    return handleValidationError(res, error)
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
    return handleValidationError(res, error)
  }
}

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    res.json({ message: 'Goal deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getGoals, createGoal, updateGoal, deleteGoal }
