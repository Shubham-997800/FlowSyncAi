const { Router } = require('express')
const { signup, login } = require('../controllers/authController')
const { authLimiter, loginLimiter } = require('../middleware/rateLimiter')
const router = Router()
router.use(authLimiter)
router.post('/signup', signup)
router.post('/login', loginLimiter, login)
module.exports = router
