export function detectBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('edge')) return 'edge'
  if (ua.includes('chrome') && !ua.includes('edge')) return 'chrome'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'
  return 'other'
}

export function getBrowserSettingsUrl() {
  const browser = detectBrowser()
  const origin = encodeURIComponent(window.location.origin)
  if (browser === 'chrome' || browser === 'edge') {
    return `chrome://settings/content/siteDetails?site=${origin}`
  }
  if (browser === 'firefox') {
    return 'about:preferences#privacy'
  }
  return null
}

export function openBrowserSettings() {
  const url = getBrowserSettingsUrl()
  if (!url) return false
  try {
    const win = window.open(url, '_blank')
    if (win) win.focus()
    return true
  } catch {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
    return true
  }
}

export function getPermissionInstructions() {
  const browser = detectBrowser()
  const map = {
    chrome: 'Settings → Privacy & Security → Site Settings → Notifications/Microphone → Allow',
    edge: 'Settings → Cookies & Site Permissions → Notifications/Microphone → Allow',
    firefox: 'Options → Privacy & Security → Permissions → Settings → Allow',
    safari: 'Preferences → Websites → Notifications/Microphone → Allow',
    other: 'Browser settings → Site Permissions → Allow for this site',
  }
  return map[browser] || map.other
}
