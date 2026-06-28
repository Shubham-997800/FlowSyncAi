import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 pt-4 pb-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Menu size={20} />
          </button>
          <span className="text-lg font-bold text-emerald-600">FlowSync AI</span>
        </div>
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
