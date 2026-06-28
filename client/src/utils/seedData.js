const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

function id() { return Math.random().toString(36).slice(2, 10) }

const tasks = [
  { _id: id(), title: 'Complete Database Assignment', description: 'Finish ER diagram and schema design', priority: 'high', dueDate: today, completed: false, createdAt: yesterday },
  { _id: id(), title: 'Review PR for frontend components', description: 'Check the new sidebar implementation', priority: 'high', dueDate: today, completed: false, createdAt: yesterday },
  { _id: id(), title: 'Prepare for team standup', description: 'Write up what I did yesterday and today\'s plan', priority: 'medium', dueDate: today, completed: true, createdAt: lastWeek },
  { _id: id(), title: 'Fix login page responsive layout', description: 'The login form breaks on mobile devices', priority: 'medium', dueDate: tomorrow, completed: false, createdAt: yesterday },
  { _id: id(), title: 'Update API documentation', description: 'Add new endpoints to the docs', priority: 'low', dueDate: tomorrow, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Design new dashboard mockup', description: 'Create Figma design for the analytics view', priority: 'medium', dueDate: nextWeek, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Write unit tests for auth service', description: 'Cover login, register, and token refresh', priority: 'high', dueDate: nextWeek, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Research AI scheduling algorithms', description: 'Look into constraint-based scheduling', priority: 'low', dueDate: nextWeek, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Refactor notification system', description: 'Move from polling to WebSocket', priority: 'medium', dueDate: nextWeek, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Fix dark mode contrast issues', description: 'Some text is hard to read in dark mode', priority: 'low', dueDate: nextWeek, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Overdue task from last week', description: 'This should have been done already', priority: 'high', dueDate: yesterday, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Another overdue item', description: 'Client requested this urgently', priority: 'high', dueDate: yesterday, completed: false, createdAt: lastWeek },
  { _id: id(), title: 'Completed task 1', description: 'Was done yesterday', priority: 'medium', dueDate: yesterday, completed: true, createdAt: lastWeek },
  { _id: id(), title: 'Completed long-term goal', description: 'Finished the main feature', priority: 'high', dueDate: lastWeek, completed: true, createdAt: lastWeek },
]

const goals = [
  { _id: id(), title: 'Launch MVP by end of quarter', description: 'Get the core product to early users', progress: 65, targetDate: nextWeek, category: 'work' },
  { _id: id(), title: 'Read 12 books this year', description: 'Personal development through reading', progress: 42, targetDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0], category: 'personal' },
  { _id: id(), title: 'Run a half marathon', description: 'Train consistently and build endurance', progress: 28, targetDate: nextWeek, category: 'health' },
  { _id: id(), title: 'Learn React Native', description: 'Build a mobile app by end of year', progress: 15, targetDate: nextWeek, category: 'learning' },
  { _id: id(), title: 'Save $10,000 emergency fund', description: 'Financial security goal', progress: 50, targetDate: nextWeek, category: 'finance' },
]

const habits = [
  { _id: id(), name: 'Morning Meditation', description: '10 minutes of mindfulness', frequency: 'daily', streak: 12, logs: [] },
  { _id: id(), name: 'Exercise', description: '30 min workout', frequency: 'daily', streak: 8, logs: [] },
  { _id: id(), name: 'Read 20 pages', description: 'Read before bed', frequency: 'daily', streak: 5, logs: [] },
  { _id: id(), name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', frequency: 'daily', streak: 3, logs: [] },
  { _id: id(), name: 'Practice coding', description: 'Solve one LeetCode problem', frequency: 'daily', streak: 15, logs: [] },
]

const notifications = [
  { id: Date.now() - 100000, icon: 'CheckCircle', title: 'Task Completed', message: 'You completed "Prepare for team standup"', type: 'success', read: false, time: new Date(Date.now() - 600000).toISOString() },
  { id: Date.now() - 200000, icon: 'Timer', title: 'Focus Session Done', message: 'You finished a 25-minute focus session', type: 'success', read: false, time: new Date(Date.now() - 1800000).toISOString() },
  { id: Date.now() - 300000, icon: 'AlertTriangle', title: 'Overdue Task', message: '"Database Assignment" is overdue', type: 'alert', read: false, time: new Date(Date.now() - 3600000).toISOString() },
  { id: Date.now() - 400000, icon: 'Flame', title: 'Habit Streak', message: '5-day meditation streak! Keep going', type: 'reminder', read: true, time: new Date(Date.now() - 7200000).toISOString() },
  { id: Date.now() - 500000, icon: 'Target', title: 'Goal Milestone', message: 'MVP launch is 65% complete', type: 'info', read: true, time: new Date(Date.now() - 14400000).toISOString() },
  { id: Date.now() - 600000, icon: 'CheckCircle', title: 'Task Completed', message: 'PR review submitted successfully', type: 'success', read: true, time: new Date(Date.now() - 28800000).toISOString() },
  { id: Date.now() - 700000, icon: 'AlertTriangle', title: 'Deadline Approaching', message: 'API docs due tomorrow', type: 'alert', read: true, time: new Date(Date.now() - 86400000).toISOString() },
]

export function seedData() {
  const seeded = localStorage.getItem('flowsync_seeded')
  if (seeded) return

  localStorage.setItem('flowsync_tasks', JSON.stringify(tasks))
  localStorage.setItem('flowsync_goals', JSON.stringify(goals))
  localStorage.setItem('flowsync_habits', JSON.stringify(habits))
  localStorage.setItem('flowsync_notifications', JSON.stringify(notifications))
  localStorage.setItem('flowsync_focus_sessions', '12')
  localStorage.setItem('flowsync_focus_minutes', '300')
  const aiPlans = [
    { id: id(), title: 'Clear overdue backlog', description: 'Focus on completing 2 overdue tasks today to reduce stress', type: 'focus', priority: 'high', createdAt: today, tasks: ['Overdue task from last week', 'Another overdue item'] },
    { id: id(), title: 'Deep work morning routine', description: 'Schedule your most important task before noon', type: 'schedule', priority: 'medium', createdAt: today, tasks: ['Complete Database Assignment'] },
    { id: id(), title: 'Break large tasks into subtasks', description: 'Split remaining tasks into smaller actionable steps', type: 'strategy', priority: 'medium', createdAt: today, tasks: [] },
  ]
  localStorage.setItem('flowsync_plans', JSON.stringify(aiPlans))
  localStorage.setItem('flowsync_notified_tasks', '[]')
  localStorage.setItem('flowsync_seeded', 'true')
}

export function clearSeedFlag() {
  localStorage.removeItem('flowsync_seeded')
}
