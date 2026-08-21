const { Router } = require('express')
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')
const { validate, goalSchemas } = require('../utils/validation')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getGoals).post(validate(goalSchemas.create), createGoal)
router.route('/:id').all(validateObjectId).put(validate(goalSchemas.update), updateGoal).delete(deleteGoal)

module.exports = router
