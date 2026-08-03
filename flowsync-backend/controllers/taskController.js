const Task = require('../models/Task')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeText } = require('../utils/sanitize')
const allowedTaskFields = ['title', 'description', 'priority', 'status', 'deadline', 'estimatedTime', 'tags']

function sanitize(body) {
  const safe = {}
  for (const key of allowedTaskFields) {
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

const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    const { skip, limit } = parsePagination(req.query)
    const total = await Task.countDocuments(filter)
    const tasks = await Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
    res.json(tasks)
  } catch (error) {
    handleError(res, error)
  }
}

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    handleError(res, error)
  }
}

const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitize(req.body),
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask }
