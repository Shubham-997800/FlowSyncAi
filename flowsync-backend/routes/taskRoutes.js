const { Router } = require('express')
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')
const { validate, taskSchemas } = require('../utils/validation')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getTasks).post(validate(taskSchemas.create), createTask)
router.route('/:id').all(validateObjectId).get(getTask).put(validate(taskSchemas.update), updateTask).delete(deleteTask)

module.exports = router
