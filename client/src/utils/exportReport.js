const STAMP = () => new Date().toISOString()

export function buildReportData(tasks = [], goals = [], habits = [], extra = {}) {
  const total = tasks.length
  const completed = tasks.filter(t => t.status === 'done').length
  const now = new Date()
  return {
    app: 'FlowSync AI',
    generatedAt: STAMP(),
    user: extra.user || null,
    totals: {
      tasks: total,
      completed,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      overdue: tasks.filter(t => t.deadline && t.status !== 'done' && new Date(t.deadline) < now).length,
      goals: goals.length,
      habits: habits.length,
      focusMinutes: extra.focusMinutes || 0,
      focusSessions: extra.focusSessions || 0,
    },
    tasks: tasks.map(t => ({
      title: t.title,
      priority: t.priority || 'medium',
      status: t.status || 'todo',
      deadline: t.deadline || null,
      createdAt: t.createdAt || null,
    })),
    goals: goals.map(g => ({ title: g.title, status: g.status || 'active', progress: g.progress ?? 0 })),
    habits: habits.map(h => ({ name: h.name, streak: h.streak || 0, bestStreak: h.bestStreak || 0 })),
  }
}

function csvCell(v) {
  let s = String(v ?? '')
  if (/^[=+\-@]/.test(s)) s = "'" + s
  return `"${s.replace(/"/g, '""')}"`
}

export function toCSVString(data) {
  const lines = [
    ['Title', 'Priority', 'Status', 'Deadline', 'Created'],
    ...data.tasks.map(t => [t.title, t.priority, t.status, t.deadline ? new Date(t.deadline).toLocaleDateString() : '', t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '']),
  ]
  return lines.map(r => r.map(csvCell).join(',')).join('\n')
}

export function toJSONString(data) {
  return JSON.stringify(data, null, 2)
}

function xmlEscape(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function toXMLString(data) {
  const rows = (items, tag) => items.map(it => {
    const inner = Object.entries(it).map(([k, v]) => {
      if (v && typeof v === 'object') return `<${k}>${v instanceof Date ? v.toISOString() : JSON.stringify(v)}</${k}>`
      return `<${k}>${xmlEscape(v)}</${k}>`
    }).join('')
    return `  <${tag}>${inner}</${tag}>`
  }).join('\n')
  const totals = Object.entries(data.totals).map(([k, v]) => `    <${k}>${v}</${k}>`).join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<report>',
    `  <meta>`,
    `    <app>${xmlEscape(data.app)}</app>`,
    `    <generatedAt>${data.generatedAt}</generatedAt>`,
    `  </meta>`,
    '  <totals>',
    totals,
    '  </totals>',
    '  <tasks>',
    rows(data.tasks, 'task'),
    '  </tasks>',
    '  <goals>',
    rows(data.goals, 'goal'),
    '  </goals>',
    '  <habits>',
    rows(data.habits, 'habit'),
    '  </habits>',
    '</report>',
  ].join('\n')
}

export function toTXTString(data) {
  const line = '='.repeat(48)
  const mid = '-'.repeat(48)
  const parts = [line, '  FLOWSYNC AI - PRODUCTIVITY REPORT', `  Generated: ${data.generatedAt}`, line]
  parts.push('')
  parts.push(`TOTALS`)
  parts.push(mid)
  for (const [k, v] of Object.entries(data.totals)) parts.push(`  ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${v}`)
  parts.push('')
  parts.push(`TASKS (${data.tasks.length})`)
  parts.push(mid)
  for (const t of data.tasks) parts.push(`  [${t.status}] ${t.title} (${t.priority})${t.deadline ? ` - due ${new Date(t.deadline).toLocaleDateString()}` : ''}`)
  parts.push('')
  parts.push(`GOALS (${data.goals.length})`)
  parts.push(mid)
  for (const g of data.goals) parts.push(`  [${g.status}] ${g.title} - ${g.progress}%`)
  parts.push('')
  parts.push(`HABITS (${data.habits.length})`)
  parts.push(mid)
  for (const h of data.habits) parts.push(`  ${h.name} - streak ${h.streak} (best ${h.bestStreak})`)
  parts.push('')
  parts.push(line)
  return parts.join('\n')
}

export async function toPDFBlob(data) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const t = data.totals
  let y = 20
  doc.setFontSize(16)
  doc.text('FlowSync AI - Productivity Report', 14, y)
  doc.setFontSize(10)
  y += 8
  doc.text(`Generated: ${data.generatedAt}`, 14, y)
  y += 8
  doc.setFontSize(12)
  doc.text(`Totals: ${t.tasks} tasks, ${t.completed} done (${t.completionRate}%), ${t.overdue} overdue | ${t.goals} goals | ${t.habits} habits`, 14, y)
  y += 8
  doc.setFontSize(11)
  for (const task of data.tasks) {
    if (y > 275) { doc.addPage(); y = 20 }
    doc.text(`- [${task.status}] ${task.title} (${task.priority})${task.deadline ? ' | due ' + new Date(task.deadline).toLocaleDateString() : ''}`, 14, y)
    y += 7
  }
  return doc.output('blob')
}

export async function toDOCXBlob(data) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx')
  const t = data.totals
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('FlowSync AI - Productivity Report')] }),
        new Paragraph({ children: [new TextRun(`Generated: ${data.generatedAt}`)] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Totals')] }),
        new Paragraph({ children: [new TextRun(`Tasks: ${t.tasks} | Completed: ${t.completed} (${t.completionRate}%) | Overdue: ${t.overdue}`)] }),
        new Paragraph({ children: [new TextRun(`Goals: ${t.goals} | Habits: ${t.habits} | Focus: ${t.focusMinutes} min in ${t.focusSessions} sessions`)] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`Tasks (${data.tasks.length})`)] }),
        ...data.tasks.map(task => new Paragraph({ children: [new TextRun(`[${task.status}] ${task.title} (${task.priority})${task.deadline ? ' - due ' + new Date(task.deadline).toLocaleDateString() : ''}`)] })),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`Goals (${data.goals.length})`)] }),
        ...data.goals.map(g => new Paragraph({ children: [new TextRun(`[${g.status}] ${g.title} - ${g.progress}%`)] })),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`Habits (${data.habits.length})`)] }),
        ...data.habits.map(h => new Paragraph({ children: [new TextRun(`${h.name} - streak ${h.streak} (best ${h.bestStreak})`)] })),
      ],
    }],
  })
  return Packer.toBlob(doc)
}

const FORMATS = {
  pdf: { label: 'PDF', mime: 'application/pdf', ext: 'pdf', make: toPDFBlob },
  docx: { label: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: 'docx', make: toDOCXBlob },
  txt: { label: 'Text', mime: 'text/plain;charset=utf-8', ext: 'txt', string: toTXTString },
  json: { label: 'JSON', mime: 'application/json;charset=utf-8', ext: 'json', string: toJSONString },
  xml: { label: 'XML', mime: 'application/xml;charset=utf-8', ext: 'xml', string: toXMLString },
  csv: { label: 'CSV', mime: 'text/csv;charset=utf-8', ext: 'csv', string: toCSVString },
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportReport(data, format) {
  const fmt = FORMATS[format]
  if (!fmt) throw new Error(`Unsupported export format: ${format}`)
  const date = new Date().toISOString().split('T')[0]
  const filename = `flowsync_report_${date}.${fmt.ext}`
  let blob
  if (fmt.make) {
    blob = await fmt.make(data)
  } else {
    const content = fmt.string ? fmt.string(data) : toJSONString(data)
    blob = new Blob(['\uFEFF' + content], { type: fmt.mime })
  }
  download(blob, filename)
  return { format, filename }
}

export const EXPORT_FORMATS = Object.entries(FORMATS).map(([value, f]) => ({ value, label: f.label }))
