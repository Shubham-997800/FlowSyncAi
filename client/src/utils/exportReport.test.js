import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  buildReportData,
  toCSVString,
  toJSONString,
  toXMLString,
  toTXTString,
  exportReport,
  EXPORT_FORMATS,
} from './exportReport'

const tasks = [
  { title: 'Ship report', priority: 'high', status: 'done', deadline: '2026-08-01T10:00:00.000Z', createdAt: '2026-07-01T10:00:00.000Z' },
  { title: 'Fix "bug" & test', priority: 'medium', status: 'todo', deadline: null, createdAt: null },
]
const goals = [{ title: 'Launch v2', status: 'active', progress: 60 }]
const habits = [{ name: 'Meditate', streak: 4, bestStreak: 7 }]

describe('buildReportData', () => {
  it('computes totals from tasks/goals/habits', () => {
    const d = buildReportData(tasks, goals, habits)
    expect(d.app).toBe('FlowSync AI')
    expect(d.totals.tasks).toBe(2)
    expect(d.totals.completed).toBe(1)
    expect(d.totals.completionRate).toBe(50)
    expect(d.totals.goals).toBe(1)
    expect(d.totals.habits).toBe(1)
    expect(typeof d.generatedAt).toBe('string')
  })
})

describe('string formats', () => {
  const d = buildReportData(tasks, goals, habits)

  it('CSV escapes quotes and commas', () => {
    const csv = toCSVString(d)
    expect(csv).toContain('"Fix ""bug"" & test"')
    expect(csv.split('\n')[0]).toBe('"Title","Priority","Status","Deadline","Created"')
  })

  it('JSON is valid and has all sections', () => {
    const parsed = JSON.parse(toJSONString(d))
    expect(parsed.totals.tasks).toBe(2)
    expect(parsed.tasks.length).toBe(2)
    expect(parsed.goals.length).toBe(1)
    expect(parsed.habits.length).toBe(1)
  })

  it('XML escapes special chars and is well-formed', () => {
    const xml = toXMLString(d)
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<app>FlowSync AI</app>')
    expect(xml).toContain('Fix &quot;bug&quot; &amp; test')
    expect(xml).toContain('<task>')
    expect(xml).toContain('</report>')
    expect(xml).not.toContain('<&')
  })

  it('TXT contains sections and task lines', () => {
    const txt = toTXTString(d)
    expect(txt).toContain('PRODUCTIVITY REPORT')
    expect(txt).toContain('TASKS (2)')
    expect(txt).toContain('[done] Ship report')
    expect(txt).toContain('GOALS (1)')
    expect(txt).toContain('HABITS (1)')
  })
})

describe('exportReport', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() })
    document.body.innerHTML = ''
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it.each(['txt', 'json', 'xml', 'csv'])('downloads %s with correct filename', async (format) => {
    const d = buildReportData(tasks, goals, habits)
    const appended = []
    vi.spyOn(document.body, 'appendChild').mockImplementation((el) => { appended.push(el); return el })
    const res = await exportReport(d, format)
    expect(res.format).toBe(format)
    expect(res.filename).toMatch(new RegExp(`flowsync_report_\\d{4}-\\d{2}-\\d{2}\\.${format}$`))
    expect(appended.length).toBe(1)
    expect(appended[0].download).toBe(res.filename)
    expect(appended[0].href).toBe('blob:mock')
  })

  it('rejects unknown formats', async () => {
    await expect(exportReport(buildReportData(tasks), 'exe')).rejects.toThrow('Unsupported')
  })

  it('exposes pdf, docx, txt, json, xml, csv options', () => {
    expect(EXPORT_FORMATS.map(f => f.value)).toEqual(['pdf', 'docx', 'txt', 'json', 'xml', 'csv'])
  })
})
