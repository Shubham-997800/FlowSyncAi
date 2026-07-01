const { Router } = require('express')
const { plan, prioritize, rescue, chatAI, suggestTaskAI, getUsage, analyticsInsights } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')
const { aiLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(aiLimiter)
router.use(protect)

router.post('/plan', plan)
router.post('/prioritize', prioritize)
router.post('/rescue', rescue)
router.post('/chat', chatAI)
router.post('/suggest-task', suggestTaskAI)
router.get('/usage', getUsage)
router.get('/analytics-insights', analyticsInsights)

module.exports = router
