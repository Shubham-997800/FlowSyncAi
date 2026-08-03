const handleError = (res, error, statusCode = 500) => {
  console.error(error)
  const message = statusCode >= 500 ? 'Server error' : error.message
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
