const { Router } = require('express')
const { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory } = require('../controllers/chatController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.get('/sessions', getChatSessions)
router.get('/', getChatHistory)
router.post('/', saveChatMessage)
router.delete('/clear', clearChatHistory)
router.delete('/:id', deleteChatMessage)

module.exports = router
