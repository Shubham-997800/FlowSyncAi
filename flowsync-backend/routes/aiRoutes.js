const { Router } = require('express')
const { plan, prioritize, rescue } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.post('/plan', plan)
router.post('/prioritize', prioritize)
router.post('/rescue', rescue)

module.exports = router
