const { Router } = require('express')
const { subscribe, unsubscribe } = require('../controllers/pushController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.post('/subscribe', subscribe)
router.post('/unsubscribe', unsubscribe)

module.exports = router
