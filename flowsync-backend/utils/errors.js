class AppError extends Error {
  constructor(message, { statusCode, code, cause } = {}) {
    super(message)
    this.name = this.constructor.name
    if (statusCode) this.statusCode = statusCode
    if (code) this.code = code
    if (cause) this.cause = cause
  }
}

class AiServiceUnavailableError extends AppError {
  constructor(message = 'AI service unavailable', cause) {
    super(message, { statusCode: 503, code: 'AI_SERVICE_UNAVAILABLE', cause })
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, { statusCode: 404, code: 'NOT_FOUND' })
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, { statusCode: 401, code: 'UNAUTHORIZED' })
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, { statusCode: 400, code: 'BAD_REQUEST' })
  }
}

module.exports = { AppError, AiServiceUnavailableError, NotFoundError, UnauthorizedError, BadRequestError }
