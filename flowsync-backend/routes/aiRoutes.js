const { Router } = require('express')
const { plan, prioritize, rescue, chatAI, chatStream, suggestTaskAI, getUsage, analyticsInsights, habitInsights, focusSuggestion, profileInsights, organizeNotifications } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')
const { aiLimiter } = require('../middleware/rateLimiter')
const { validate, aiSchemas } = require('../utils/validation')

const router = Router()
router.use(aiLimiter)
router.use(protect)

router.post('/plan', validate(aiSchemas.plan), plan)
router.post('/prioritize', prioritize)
router.post('/rescue', rescue)
router.post('/chat', validate(aiSchemas.chat), chatAI)
router.post('/chat/stream', validate(aiSchemas.chat), chatStream)
router.post('/suggest-task', validate(aiSchemas.suggestTask), suggestTaskAI)
router.get('/usage', getUsage)
router.get('/analytics-insights', analyticsInsights)
router.get('/habit-insights', habitInsights)
router.post('/focus-suggest', validate(aiSchemas.focusSuggest), focusSuggestion)
router.get('/profile-insights', profileInsights)
router.post('/organize-notifications', validate(aiSchemas.organizeNotifications), organizeNotifications)

module.exports = router
