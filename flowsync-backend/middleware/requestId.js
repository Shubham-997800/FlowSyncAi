const crypto = require('crypto')

function requestId(req, res, next) {
  const client = req.headers['x-request-id']
  req.id = typeof client === 'string' && /^[\w.-]{1,64}$/.test(client) ? client : crypto.randomUUID()
  res.setHeader('X-Request-Id', req.id)
  next()
}

module.exports = { requestId }
