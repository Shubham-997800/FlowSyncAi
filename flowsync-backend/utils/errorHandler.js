function normalizeError(error) {
  if (error?.errors && typeof error.errors === 'object') {
    const msgs = Object.values(error.errors).map(e => e.message || 'Invalid value').join(', ')
    return { statusCode: 400, code: 'VALIDATION_ERROR', message: msgs }
  }
  if (error?.name === 'ValidationError') {
    const msgs = (error.errors && Object.values(error.errors).map(e => e.message || 'Invalid value').join(', ')) || 'Validation failed'
    return { statusCode: 400, code: 'VALIDATION_ERROR', message: msgs }
  }
  if (error?.code === 11000) return { statusCode: 409, code: 'DUPLICATE_FIELD', message: 'Duplicate field value' }
  if (error?.name === 'CastError') return { statusCode: 400, code: 'INVALID_ID', message: 'Invalid ID' }
  if (error?.type === 'entity.parse.failed') return { statusCode: 400, code: 'INVALID_JSON', message: 'Invalid JSON in request body' }
  if (error?.type === 'entity.too.large') return { statusCode: 413, code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' }
  if (error?.statusCode) return { statusCode: error.statusCode, code: error.code || 'ERROR', message: error.message || 'Request failed' }
  return { statusCode: 500, code: 'SERVER_ERROR', message: 'Server error' }
}

const handleError = (res, error, statusCode) => {
  if (error) console.error(error)
  const normalized = normalizeError(error)
  const finalStatus = statusCode || normalized.statusCode
  const isServer = finalStatus >= 500
  const body = {
    message: isServer ? 'Server error' : (normalized.message || error?.message || 'Request failed'),
  }
  if (isServer) body.code = 'SERVER_ERROR'
  else if (normalized.code) body.code = normalized.code
  res.status(finalStatus).json(body)
}

const handleValidationError = (res, error) => handleError(res, error)

module.exports = { handleError, handleValidationError, normalizeError }
