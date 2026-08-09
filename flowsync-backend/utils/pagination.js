// Shared pagination parsing with sane defaults and clamping.
function parsePagination(query, defaults = {}) {
  const page = Math.max(parseInt(query.page, 10) || defaults.page || 1, 1)
  const defaultLimit = defaults.limit || 500
  const maxLimit = defaults.maxLimit || 1000
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit)
  return { page, limit, skip: (page - 1) * limit }
}

// Cursor pagination: opaque, stable keyset pointers so deep pages don't drift
// when items are inserted/deleted between requests. A cursor encodes
// { ts: ISO createdAt, id: _id } of the last item of the previous page.
function encodeCursor(createdAt, id) {
  const raw = JSON.stringify({ ts: new Date(createdAt).toISOString(), id: String(id) })
  return Buffer.from(raw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Returns a Mongo $or predicate selecting every doc that sorts AFTER the cursor
// under a (createdAt desc, _id desc) keyset. Returns null when no/invalid cursor.
function parseCursor(query) {
  const raw = String(query?.cursor || '').trim()
  if (!raw) return null
  try {
    const json = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    const { ts, id } = JSON.parse(json)
    const date = new Date(ts)
    if (!id || Number.isNaN(date.getTime())) return null
    return {
      $or: [
        { createdAt: { $lt: date } },
        { createdAt: date, _id: { $lt: id } },
      ],
    }
  } catch {
    return null
  }
}

module.exports = { parsePagination, parseCursor, encodeCursor }
