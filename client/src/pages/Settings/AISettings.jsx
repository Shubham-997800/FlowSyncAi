import { useState, useEffect } from 'react'
import { Brain, Zap, Timer, ArrowDown, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleAIConsent as toggleConsentApi, getProfile } from '../../services/settingsService'

function AISettings() {
  const [aiConsent, setAiConsent] = useState(false)
  const [settings, setSettings] = useState({
    aggressiveness: 'medium',
    autoScheduling: true,
    smartPrioritization: true,
    rescueMode: false,
  })

  useEffect(() => {
    getProfile().then(u => setAiConsent(u.aiConsent || false)).catch(() => {})
  }, [])

  const toggle = (key) => {
    setSettings(s => {
      const updated = { ...s, [key]: !s[key] }
      toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} ${updated[key] ? 'enabled' : 'disabled'}`)
      return updated
    })
  }

  const handleConsentToggle = async () => {
    const next = !aiConsent
    try {
      await toggleConsentApi(next)
      setAiConsent(next)
      toast.success(next ? 'AI suggestions enabled' : 'AI suggestions disabled')
    } catch {
      toast.error('Failed to update AI consent')
    }
  }

  const setAggressiveness = (val) => {
    setSettings(s => ({ ...s, aggressiveness: val }))
    toast.success(`AI aggressiveness set to ${val}`)
  }

  const levels = [
    { key: 'low', label: 'Low', desc: 'Gentle suggestions, minimal automation' },
    { key: 'medium', label: 'Medium', desc: 'Balanced assistance and automation' },
    { key: 'high', label: 'High', desc: 'Proactive scheduling and prioritization' },
  ]

  const toggles = [
    { key: 'autoScheduling', label: 'Auto Scheduling', desc: 'AI automatically schedules tasks based on priority and deadlines', icon: Timer },
    { key: 'smartPrioritization', label: 'Smart Prioritization', desc: 'AI reorders your task list to focus on what matters most', icon: Zap },
    { key: 'rescueMode', label: 'Rescue Mode', desc: 'AI reorganizes your schedule when you fall behind', icon: ArrowDown },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Brain size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Preferences</h2>
        </div>
        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium flex items-center gap-1">
          <Brain size={10} /> AI
        </span>
      </div>

      <div className="mb-6 p-4 rounded-xl border-2 transition-all duration-300 ${aiConsent ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50'}">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {aiConsent ? <CheckCircle size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-slate-400" />}
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Suggestions</span>
          </div>
          <button onClick={handleConsentToggle} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${aiConsent ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${aiConsent ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-7">
          {aiConsent
            ? 'AI can suggest priorities, deadlines, tags, and productivity tips across all pages. You retain full control — suggestions are advisory only.'
            : 'AI suggestions are disabled. Enable this to get smart priority estimates, deadline recommendations, and productivity insights.'}
        </p>
        {aiConsent && (
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 ml-7 mt-1 font-medium">
            Daily limit: 200 AI responses
          </p>
        )}
      </div>

      {aiConsent && (
        <>
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">AI Aggressiveness</h3>
            <div className="grid sm:grid-cols-3 gap-2">
              {levels.map(({ key, label, desc }) => (
                <button key={key} onClick={() => setAggressiveness(key)} className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${settings.aggressiveness === key ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'}`}>
                  <p className={`text-sm font-semibold ${settings.aggressiveness === key ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {toggles.map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Icon size={13} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                </div>
                <button onClick={() => toggle(key)} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${settings[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AISettings
