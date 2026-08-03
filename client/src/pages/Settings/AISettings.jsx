import { useState, useEffect } from 'react'
import { Brain, Zap, Timer, ArrowDown, Loader2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const DEFAULT_SETTINGS = {
  aggressiveness: 'medium',
  autoScheduling: true,
  smartPrioritization: true,
  rescueMode: false,
}

function AISettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const [rescueResult, setRescueResult] = useState(null)
  const [rescueLoading, setRescueLoading] = useState(false)

  useEffect(() => {
    api.get('/api/settings/ai')
      .then(({ data }) => setSettings({ ...DEFAULT_SETTINGS, ...(data || {}) }))
      .catch(() => toast.error('Failed to load AI settings'))
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (!loaded) return
    const { aggressiveness, autoScheduling, smartPrioritization, rescueMode } = settings
    api.put('/api/settings/ai', { aggressiveness, autoScheduling, smartPrioritization, rescueMode })
      .catch(() => toast.error('Failed to save AI settings'))
  }, [settings, loaded])

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} ${updated[key] ? 'enabled' : 'disabled'}`)
  }

  const activateRescue = async () => {
    setRescueLoading(true)
    setRescueResult(null)
    try {
      const { data } = await api.post('/api/ai/rescue')
      setRescueResult(data)
      setSettings(s => ({ ...s, rescueMode: true }))
      toast.success('Rescue Mode activated!')
    } catch {
      toast.error('Failed to activate Rescue Mode')
    } finally {
      setRescueLoading(false)
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

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">AI Aggressiveness</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {levels.map(({ key, label, desc }) => (
            <button key={key} onClick={() => setAggressiveness(key)} className={`p-3 rounded-xl border-2 text-left transition-all ${settings.aggressiveness === key ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'}`}>
              <p className={`text-sm font-semibold ${settings.aggressiveness === key ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {toggles.map(({ key, label, desc, icon: Icon }) => (
    <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Icon size={13} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
              {key === 'rescueMode' ? (
                <button onClick={activateRescue} disabled={rescueLoading} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${settings.rescueMode ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'}`}>
                  {rescueLoading ? <Loader2 size={12} className="animate-spin" /> : settings.rescueMode ? <CheckCircle size={12} /> : <ArrowDown size={12} />}
                  {rescueLoading ? 'Analyzing...' : settings.rescueMode ? 'Active' : 'Activate'}
                </button>
              ) : (
                <button onClick={() => toggle(key)} role="switch" aria-checked={settings[key]} className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${settings[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              )}
            </div>
        ))}
      </div>
      {rescueResult && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowDown size={14} className="text-red-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rescue Plan</h4>
            </div>
            <button onClick={() => setRescueResult(null)} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Dismiss</button>
          </div>
          {rescueResult.criticalTasks?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Critical Tasks</p>
              <div className="space-y-1">
                {rescueResult.criticalTasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50">
                    <XCircle size={12} className="text-red-500 flex-shrink-0" />
                    <span className="text-xs text-slate-700 dark:text-slate-300">{t.title}</span>
                    {t.reason && <span className="text-[10px] text-slate-400 ml-auto">{t.reason}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {rescueResult.timeCompressionStrategy && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
              <Brain size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300">{rescueResult.timeCompressionStrategy}</p>
            </div>
          )}
          {rescueResult.dropRecommendations?.length > 0 && (
            <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <Brain size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-0.5">Consider dropping:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{rescueResult.dropRecommendations.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AISettings
