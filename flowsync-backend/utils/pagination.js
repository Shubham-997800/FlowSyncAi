// Shared pagination parsing with sane defaults and clamping.
function parsePagination(query, defaults = {}) {
  const page = Math.max(parseInt(query.page, 10) || defaults.page || 1, 1)
  const defaultLimit = defaults.limit || 500
  const maxLimit = defaults.maxLimit || 1000
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit)
  return { page, limit, skip: (page - 1) * limit }
}

module.exports = { parsePagination }
