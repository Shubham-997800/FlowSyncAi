import { useState, useEffect } from 'react'
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Download, Loader2 } from 'lucide-react'
import { getAnalyticsInsights } from '../../services/aiService'

function AIReport({ tasks, completionRate, overdue, focusSessions, habitStreaks }) {
  const [aiData, setAiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalyticsInsights()
        if (res && res.recommendations) {
          setAiData(res)
        }
      } catch {
        setError(true)
      } finally { setLoading(false) }
    })()
  }, [])

  const handleDownload = () => {
    const now = new Date().toLocaleDateString()
    const text = [
      `AI Productivity Report - ${now}`,
      `Completion Rate: ${completionRate}%`,
      `Overdue Tasks: ${overdue}`,
      `Focus Sessions: ${focusSessions}`,
      `Habit Streaks: ${habitStreaks}`,
      `Total Tasks: ${tasks.length}`,
      '',
      '--- Strengths ---',
      ...(aiData?.strengths || (completionRate >= 70 ? ['- High task completion rate'] : [])),
      '',
      '--- Areas to Improve ---',
      ...(aiData?.weaknesses || (overdue > 3 ? [`- ${overdue} overdue tasks`] : [])),
      '',
      '--- Recommendations ---',
      ...(aiData?.recommendations || []),
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `productivity_report_${new Date().toISOString().split('T')[0]}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const morningTasks = tasks.filter(t => {
    if (!t.createdAt) return false
    const h = new Date(t.createdAt).getHours()
    return h >= 6 && h < 12
  }).length
  const afternoonTasks = tasks.filter(t => {
    if (!t.createdAt) return false
    const h = new Date(t.createdAt).getHours()
    return h >= 12 && h < 18
  }).length

  const strengths = aiData?.strengths || []
  const weaknesses = aiData?.weaknesses || []
  const recommendations = aiData?.recommendations || []

  if (!loading && !error && (!aiData || strengths.length === 0)) {
    if (completionRate >= 70) strengths.push('High task completion rate — you consistently finish what you start')
    if (focusSessions >= 10) strengths.push('Strong focus discipline with regular Pomodoro sessions')
    if (habitStreaks >= 3) strengths.push('Building good habit streaks — consistency is your advantage')
    if (morningTasks > afternoonTasks) strengths.push('Most productive in morning hours — optimal for deep work')
    else strengths.push('Good afternoon productivity — use this window for collaborative work')

    if (completionRate < 50) weaknesses.push('Task completion rate needs improvement — try reducing scope')
    if (overdue > 3) weaknesses.push(`${overdue} overdue tasks — review deadlines and reprioritize`)
    if (focusSessions < 5) weaknesses.push('Low focus session count — aim for at least 1 session daily')
    if (tasks.length === 0) weaknesses.push('No tasks tracked yet — consistency starts with small daily entries')

    if (overdue > 0) recommendations.push(`Focus on ${overdue} overdue tasks first to clear backlog`)
    if (completionRate < 70) recommendations.push('Break large tasks into smaller subtasks to improve completion rate')
    if (morningTasks > 0) recommendations.push('Schedule your most important tasks before noon for peak cognitive performance')
    recommendations.push('Take a 5-minute break every 25 minutes to maintain sustained focus')

    if (strengths.length === 0) strengths.push('Start tracking tasks to receive personalized insights')
    if (weaknesses.length === 0) weaknesses.push('Keep up the good work — maintain your current momentum')
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Productivity Report</h2>
          {loading && <p className="text-xs text-slate-400 mt-1"><Loader2 size={10} className="inline animate-spin" /> Generating insights...</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="px-2 py-1 rounded-lg text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition flex items-center gap-1">
            <Download size={10} /> Download
          </button>
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium flex items-center gap-1">
            <Brain size={10} /> {error ? 'Local' : 'AI Powered'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900/40 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp size={14} className="text-emerald-500" />
                <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Strengths</h3>
              </div>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <div key={i} className="flex gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                    <Lightbulb size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle size={14} className="text-amber-500" />
                <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">To Improve</h3>
              </div>
              <div className="space-y-2">
                {weaknesses.map((w, i) => (
                  <div key={i} className="flex gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                    <AlertTriangle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-300">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Brain size={12} /> Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 w-4">{i + 1}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {aiData && (aiData.productivityScore !== undefined || aiData.predictedCompletionRate !== undefined) && (
            <div className="grid grid-cols-2 gap-3 mt-5">
              {aiData.productivityScore !== undefined && (
                <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 text-center">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{aiData.productivityScore}/100</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">AI Productivity Score</p>
                </div>
              )}
              {aiData.predictedCompletionRate !== undefined && (
                <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 text-center">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{aiData.predictedCompletionRate}%</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Predicted Completion</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AIReport