function getOS(ua) {
  if (/Windows NT 10/i.test(ua)) return 'Windows 10/11'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Mac OS X/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Unknown OS'
}

function getBrowser(ua) {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/Chrome/i.test(ua)) return 'Chrome'
  if (/Firefox/i.test(ua)) return 'Firefox'
  if (/Safari/i.test(ua)) return 'Safari'
  if (/Opera|OPR/i.test(ua)) return 'Opera'
  return 'Browser'
}

export function detectDevice() {
  if (typeof window === 'undefined') return { type: 'desktop', isMobile: false, isTablet: false, isDesktop: true }
  const ua = navigator.userAgent
  const isMobileUA = /Android|iPhone|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTabletUA = /iPad|Tablet|PlayBook|Silk/i.test(ua)
  const touchPoints = navigator.maxTouchPoints || 0
  const smallScreen = window.innerWidth < 768

  let type = 'desktop'
  if (isTabletUA || (isMobileUA && window.innerWidth >= 768 && touchPoints > 1)) type = 'tablet'
  else if (isMobileUA || smallScreen) type = 'mobile'

  return {
    type,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    touch: touchPoints > 0,
    touchPoints,
    width: window.innerWidth,
    height: window.innerHeight,
    os: getOS(ua),
    browser: getBrowser(ua),
  }
}
