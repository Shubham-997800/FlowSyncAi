import { describe, it, expect, afterEach } from 'vitest'
import { detectBrowser, getBrowserSettingsUrl, getPermissionInstructions } from './permissions'

function setUA(ua) {
  Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true })
}

describe('permissions utils', () => {
  const originals = { ua: navigator.userAgent, origin: window.location.origin }

  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: originals.ua, configurable: true })
  })

  it('detects chrome', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36')
    expect(detectBrowser()).toBe('chrome')
  })

  it('detects edge before chrome (edge includes Chrome in UA)', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0')
    expect(detectBrowser()).toBe('edge')
  })

  it('detects firefox', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0')
    expect(detectBrowser()).toBe('firefox')
  })

  it('detects safari (Chrome absent)', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15')
    expect(detectBrowser()).toBe('safari')
  })

  it('falls back to other for unknown UAs', () => {
    setUA('UnknownBrowser/1.0')
    expect(detectBrowser()).toBe('other')
  })

  it('builds a chrome site-details settings URL', () => {
    setUA('Mozilla/5.0 Chrome/120.0 Safari/537.36')
    const url = getBrowserSettingsUrl()
    expect(url).toContain('chrome://settings/content/siteDetails')
    expect(url).toContain(encodeURIComponent(window.location.origin))
  })

  it('returns a static firefox privacy URL', () => {
    setUA('Firefox/121.0')
    expect(getBrowserSettingsUrl()).toBe('about:preferences#privacy')
  })

  it('returns null for unsupported browsers', () => {
    setUA('UnknownBrowser/1.0')
    expect(getBrowserSettingsUrl()).toBeNull()
  })

  it('maps instructions per browser', () => {
    setUA('Firefox/121.0')
    expect(getPermissionInstructions()).toContain('Options')
    expect(getPermissionInstructions()).toContain('Allow')
  })

  it('gives a generic instruction for unknown browsers', () => {
    setUA('UnknownBrowser/1.0')
    expect(getPermissionInstructions()).toContain('Browser settings')
  })
})
