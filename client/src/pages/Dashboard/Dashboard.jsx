import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import DashboardCards from './DashboardCards'
import QuickActions from './QuickActions'
import ProductivityScore from './ProductivityScore'
import AIRecommendation from './AIRecommendation'
import DeadlineRisk from './DeadlineRisk'
import TodayTasks from './TodayTasks'
import RecentActivity from './RecentActivity'

function Dashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  )
}

export default Dashboard
