import PriorityCard from './PriorityCard'
import ScheduleCard from './ScheduleCard'
import SuggestionCard from './SuggestionCard'

function AIResult({ result }) {
  return (
    <div className="space-y-6">
      <PriorityCard tasks={result.priority} />
      <ScheduleCard schedule={result.schedule} />
      <SuggestionCard suggestions={result.suggestions} />
    </div>
  )
}

export default AIResult
