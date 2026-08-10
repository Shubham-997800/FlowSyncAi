const Task = require('../models/Task')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeBody } = require('../utils/sanitize')
const { parsePagination, parseCursor, encodeCursor } = require('../utils/pagination')
const allowedTaskFields = ['title', 'description', 'priority', 'status', 'deadline', 'estimatedTime', 'tags']
const textFields = ['title', 'description']
const VALID_STATUS = ['todo', 'in_progress', 'done']
const VALID_PRIORITY = ['low', 'medium', 'high']
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    if (req.query.status && VALID_STATUS.includes(req.query.status)) filter.status = req.query.status
    if (req.query.priority && VALID_PRIORITY.includes(req.query.priority)) filter.priority = req.query.priority
    if (req.query.q) {
      const q = String(req.query.q).trim().slice(0, 100)
      if (q) filter.title = { $regex: escapeRegex(q), $options: 'i' }
    }
    if (req.query.due === 'today') {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      filter.deadline = { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) }
    }
    const { skip, limit } = parsePagination(req.query)
    const cursorFilter = parseCursor(req.query)
    if (cursorFilter) {
      const tasks = await Task.find({ ...filter, ...cursorFilter })
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
      if (tasks.length === limit) {
        const last = tasks[tasks.length - 1]
        res.set('X-Next-Cursor', encodeCursor(last.createdAt, last._id))
      }
      return res.json(tasks)
    }
    const total = await Task.countDocuments(filter)
    const tasks = await Task.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
    if (tasks.length === limit && skip + tasks.length < total) {
      const last = tasks[tasks.length - 1]
      res.set('X-Next-Cursor', encodeCursor(last.createdAt, last._id))
    }
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
    const task = await Task.create({ ...sanitizeBody(req.body, allowedTaskFields, textFields), user: req.user._id })
    res.status(201).json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitizeBody(req.body, allowedTaskFields, textFields),
      { returnDocument: 'after', runValidators: true }
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
