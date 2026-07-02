const { Router } = require('express')
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getTasks).post(createTask)
router.route('/:id').all(validateObjectId).put(updateTask).delete(deleteTask)

module.exports = router
