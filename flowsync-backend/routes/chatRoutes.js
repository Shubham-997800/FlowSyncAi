const { Router } = require('express')
const { getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory } = require('../controllers/chatController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(protect)
router.use(generalLimiter)

router.get('/', getChatHistory)
router.post('/', saveChatMessage)
router.delete('/clear', clearChatHistory)
router.delete('/:id', deleteChatMessage)

module.exports = router
