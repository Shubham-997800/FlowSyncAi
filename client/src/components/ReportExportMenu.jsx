import { useState, useRef, useEffect } from 'react'
import { Download, Loader2, Check, FileText, FileCode2, FileJson, FileType, FileSpreadsheet, FileDown } from 'lucide-react'
import { EXPORT_FORMATS } from '../utils/exportReport'

const ICONS = { pdf: FileText, docx: FileText, txt: FileType, json: FileJson, xml: FileCode2, csv: FileSpreadsheet }

export default function ReportExportMenu({ onExport, disabled }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(null)
  const [last, setLast] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const options = EXPORT_FORMATS

  const handle = async (value) => {
    setOpen(false)
    setBusy(value)
    try {
      await onExport(value)
      setLast(value)
      setTimeout(() => setLast(null), 2500)
    } catch {
      setLast('error')
      setTimeout(() => setLast(null), 2500)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={disabled || busy}
        className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : last === 'error' ? <FileDown size={14} className="text-red-500" /> : last ? <Check size={14} className="text-emerald-500" /> : <Download size={14} />}
        {busy ? `Exporting ${busy.toUpperCase()}...` : last === 'error' ? 'Export failed' : last ? 'Exported!' : 'Export'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden" role="menu">
          {options.map(o => {
            const Icon = ICONS[o.value]
            return (
              <button
                key={o.value}
                role="menuitem"
                onClick={() => handle(o.value)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Icon size={15} className="text-slate-400 dark:text-slate-500" />
                {o.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
