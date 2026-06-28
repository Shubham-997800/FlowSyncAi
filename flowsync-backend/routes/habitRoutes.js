const { Router } = require('express')
const { getHabits, createHabit, updateHabit, deleteHabit } = require('../controllers/habitController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.route('/').get(getHabits).post(createHabit)
router.route('/:id').put(updateHabit).delete(deleteHabit)

module.exports = router
