import { useState } from 'react'
import { Music } from 'lucide-react'

const sounds = [
  { key: 'lofi', label: 'Lo-fi', icon: '🎵' },
  { key: 'rain', label: 'Rain', icon: '🌧️' },
  { key: 'whitenoise', label: 'White Noise', icon: '🌊' },
  { key: 'nature', label: 'Nature', icon: '🌿' },
]

function FocusMusic() {
  const [active, setActive] = useState(null)
  const [volume, setVolume] = useState(50)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Music size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ambient Sounds</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {sounds.map(s => (
          <button
            key={s.key}
            onClick={() => setActive(active === s.key ? null : s.key)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${active === s.key ? 'bg-indigo-600 dark:bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {active && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 w-10">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{volume}%</span>
        </div>
      )}
    </div>
  )
}

export default FocusMusic
