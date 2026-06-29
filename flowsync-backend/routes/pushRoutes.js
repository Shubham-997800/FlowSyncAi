const { Router } = require('express')
const { subscribe, unsubscribe } = require('../controllers/pushController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.post('/subscribe', subscribe)
router.post('/unsubscribe', unsubscribe)

module.exports = router
