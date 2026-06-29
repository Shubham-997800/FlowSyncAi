const { Router } = require('express')
const { signup, login } = require('../controllers/authController')
const { authLimiter } = require('../middleware/rateLimiter')
const router = Router()
router.use(authLimiter)
router.get('/ping', (req, res) => res.json({ ok: true }))
router.get('/ping-async', async (req, res, next) => {
  try { res.json({ ok: true }) } catch (e) { next(e) }
})
router.post('/signup', signup)
router.post('/login', login)
module.exports = router
