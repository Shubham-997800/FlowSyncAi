const Goal = require('../models/Goal')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeBody } = require('../utils/sanitize')
const { parsePagination } = require('../utils/pagination')
const allowedFields = ['title', 'description', 'targetDate', 'status', 'progress']
const textFields = ['title', 'description']

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
    const goal = await Goal.create({ ...sanitizeBody(req.body, allowedFields, textFields), user: req.user._id })
    res.status(201).json(goal)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitizeBody(req.body, allowedFields, textFields),
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
