const handleError = (res, error, statusCode = 500) => {
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : error.message
  if (statusCode === 500) console.error(error)
  res.status(statusCode).json({ message })
}

const handleValidationError = (res, error) => {
  if (error.errors && typeof error.errors === 'object') {
    const msgs = Object.values(error.errors).map(e => e.message).join(', ')
    return res.status(400).json({ message: msgs })
  }
  handleError(res, error)
}

module.exports = { handleError, handleValidationError }
