// Minimal dependency-free user-agent classifier for session labels.
function parseUserAgent(ua = '') {
  const s = String(ua)
  let browser = 'Unknown browser'
  if (/edg\//i.test(s)) browser = 'Edge'
  else if (/opr\/|opera/i.test(s)) browser = 'Opera'
  else if (/samsungbrowser/i.test(s)) browser = 'Samsung Internet'
  else if (/chrome|crios/i.test(s)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(s)) browser = 'Firefox'
  else if (/safari/i.test(s)) browser = 'Safari'

  let os = 'Unknown OS'
  if (/windows/i.test(s)) os = 'Windows'
  else if (/android/i.test(s)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(s)) os = 'iOS'
  else if (/mac os x|macintosh/i.test(s)) os = 'macOS'
  else if (/linux/i.test(s)) os = 'Linux'

  const deviceType = /mobile/i.test(s) ? 'Mobile' : /tablet|ipad/i.test(s) ? 'Tablet' : 'Desktop'
  return { browser, os, device: `${deviceType} · ${browser}` }
}

module.exports = { parseUserAgent }
