const { Router } = require('express')
const { plan, prioritize, rescue, chatAI } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.post('/plan', plan)
router.post('/prioritize', prioritize)
router.post('/rescue', rescue)
router.post('/chat', chatAI)

module.exports = router
