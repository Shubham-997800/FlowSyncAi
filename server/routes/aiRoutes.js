const { Router } = require('express')
const { prioritize, schedule } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

const router = Router()

router.use(protect)

router.post('/prioritize', prioritize)
router.post('/schedule', schedule)

module.exports = router
