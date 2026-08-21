const { Router } = require('express')
const { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit } = require('../controllers/habitController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')
const { validate, habitSchemas } = require('../utils/validation')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getHabits).post(validate(habitSchemas.create), createHabit)
router.route('/:id').all(validateObjectId).put(validate(habitSchemas.update), updateHabit).delete(deleteHabit)
router.post('/:id/checkin', validateObjectId, checkInHabit)

module.exports = router
