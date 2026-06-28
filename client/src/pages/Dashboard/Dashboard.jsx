import DashboardHeader from './DashboardHeader'
import DashboardCards from './DashboardCards'
import QuickActions from './QuickActions'
import ProductivityScore from './ProductivityScore'
import AIRecommendation from './AIRecommendation'
import DeadlineRisk from './DeadlineRisk'
import TodayTasks from './TodayTasks'
import RecentActivity from './RecentActivity'

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader />
      <DashboardCards />
      <QuickActions />
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <TodayTasks />
        <ProductivityScore />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <AIRecommendation />
        <DeadlineRisk />
      </div>
      <RecentActivity />
    </div>
  )
}

export default Dashboard
