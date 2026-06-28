import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { usePushNotifications } from '../hooks/usePushNotifications'

function MainLayout() {
  const { user } = useAuth()
  const { sendNotification } = usePushNotifications()
  const location = useLocation()

  useEffect(() => {
    if (!user) return

    const checkDeadlines = () => {
      try {
        const data = localStorage.getItem('flowsync_tasks')
        const tasks = data ? JSON.parse(data) : []
        const today = new Date().toISOString().split('T')[0]
        const notified = JSON.parse(localStorage.getItem('flowsync_notified_tasks') || '[]')

        tasks.forEach(task => {
          if (task.completed || notified.includes(task._id)) return

          if (task.dueDate && task.dueDate < today) {
            sendNotification('Overdue Task', {
              body: `"${task.title}" is overdue. Check your tasks.`,
            })
            localStorage.setItem('flowsync_notified_tasks', JSON.stringify([...notified, task._id]))
          } else if (task.dueDate === today) {
            sendNotification('Task Due Today', {
              body: `"${task.title}" is due today!`,
            })
            localStorage.setItem('flowsync_notified_tasks', JSON.stringify([...notified, task._id]))
          }
        })
      } catch { /* ignore */ }
    }

    checkDeadlines()
  }, [user, sendNotification])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
