const Goal = require('../models/Goal')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeText } = require('../utils/sanitize')
const allowedFields = ['title', 'description', 'targetDate', 'status', 'progress']

function sanitize(body) {
  const safe = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      safe[key] = (key === 'title' || key === 'description') ? sanitizeText(body[key]) : body[key]
    }
  }
  return safe
}

function parsePagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit) || 500, 1), 1000)
  return { page, limit, skip: (page - 1) * limit }
}

const getGoals = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    const { skip, limit } = parsePagination(req.query)
    const total = await Goal.countDocuments(filter)
    const goals = await Goal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
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
      { returnDocument: 'after', runValidators: true }
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
