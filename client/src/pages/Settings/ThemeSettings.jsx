import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
// Theme mode selector with light, dark, and system options
function Palette(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  )
}

const options = [
  { key: 'light', label: 'Light', desc: 'Bright and clean interface', icon: Sun },
  { key: 'dark', label: 'Dark', desc: 'Easy on the eyes at night', icon: Moon },
  { key: 'system', label: 'System', desc: 'Follows your system preference', icon: Monitor },
]

function ThemeSettings() {
  const { mode, setMode } = useTheme()

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Palette size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Theme</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {options.map(({ key, label, desc, icon: Icon }) => (
          <button key={key} onClick={() => setMode(key)} className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${mode === key ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
            {mode === key && <Check size={14} className="absolute top-2 right-2 text-indigo-600 dark:text-indigo-400" />}
            <Icon size={22} className={mode === key ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
            <p className={`text-sm font-semibold mt-2 ${mode === key ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {mode === 'light' && 'Light mode keeps things bright and easy to read in any well-lit environment.'}
          {mode === 'dark' && 'Dark mode reduces eye strain and saves battery on OLED displays.'}
          {mode === 'system' && 'Your device will automatically switch between light and dark themes.'}
        </p>
      </div>
    </div>
  )
}

export default ThemeSettings
