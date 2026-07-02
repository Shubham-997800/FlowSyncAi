const crypto = require('crypto')

function requestId(req, res, next) {
  req.id = req.headers['x-request-id'] || crypto.randomUUID()
  res.setHeader('X-Request-Id', req.id)
  next()
}

module.exports = { requestId }
