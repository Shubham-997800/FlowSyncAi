require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Task = require('./models/Task')
const Goal = require('./models/Goal')
const Habit = require('./models/Habit')
const Notification = require('./models/Notification')

const TEST_EMAIL = 'test@flowsync.ai'
const TEST_PASSWORD = 'Test@123456'

const now = new Date()

function daysAgo(n) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d
}

function daysFromNow(n) {
  const d = new Date(now)
  d.setDate(d.getDate() + n)
  return d
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const realTasks = [
  { title: 'Complete Q3 financial report for board meeting', priority: 'high', desc: 'Prepare revenue analysis, expense breakdown, and growth projections for quarterly board presentation.' },
  { title: 'Review pull requests on authentication module', priority: 'high', desc: 'Review 3 open PRs related to OAuth2 implementation and session management.' },
  { title: 'Fix production bug: payment gateway timeout', priority: 'high', desc: 'Users reporting 504 errors during checkout. Investigate Stripe integration.' },
  { title: 'Prepare client proposal for Acme Corp', priority: 'high', desc: 'Scope of work, timeline, pricing for enterprise onboarding project.' },
  { title: 'Deploy hotfix for login redirect issue', priority: 'high', desc: 'Production hotfix — login redirects to blank page on Safari.' },
  { title: 'Design system migration — update button component', priority: 'medium', desc: 'Migrate all Button variants to new design tokens per Figma v3.' },
  { title: 'Write unit tests for task controller', priority: 'medium', desc: 'Cover create, update, delete, and edge cases for task controller.' },
  { title: 'Optimize MongoDB aggregate queries', priority: 'medium', desc: 'Analytics page loading slow. Add indexes and optimize pipeline stages.' },
  { title: 'Set up CI/CD pipeline for staging environment', priority: 'medium', desc: 'Configure GitHub Actions for auto-deploy to staging on PR merge.' },
  { title: 'Update API documentation for v2 endpoints', priority: 'medium', desc: 'Document new analytics and AI endpoints with request/response examples.' },
  { title: 'Refactor notification service to use observer pattern', priority: 'medium', desc: 'Current implementation tightly coupled. Decouple for better testability.' },
  { title: 'Database backup strategy documentation', priority: 'medium', desc: 'Document backup schedule, retention policy, and restore procedure.' },
  { title: 'Accessibility audit — keyboard navigation', priority: 'medium', desc: 'Ensure all interactive elements are reachable and operable via keyboard.' },
  { title: 'Implement rate limiting for AI endpoints', priority: 'medium', desc: 'Prevent abuse of AI API by implementing token bucket algorithm.' },
  { title: 'Dashboard performance optimization', priority: 'medium', desc: 'Reduce API calls on dashboard load. Implement caching layer.' },
  { title: 'Review team code for security vulnerabilities', priority: 'medium', desc: 'Scan for OWASP Top 10 issues in recent commits.' },
  { title: 'Update dependencies to latest versions', priority: 'low', desc: 'Check npm audit and update all packages to latest compatible versions.' },
  { title: 'Add dark mode support for charts', priority: 'low', desc: 'Chart.js configuration update for dark theme color scheme.' },
  { title: 'Create onboarding tutorial screens', priority: 'low', desc: 'Design and implement 4-step onboarding flow for new users.' },
  { title: 'Write blog post about AI productivity', priority: 'low', desc: 'Draft engineering blog post about how we integrated Grok AI.' },
  { title: 'Add export to CSV feature', priority: 'low', desc: 'Allow users to export task list and analytics as CSV files.' },
  { title: 'Implement undo delete for tasks', priority: 'low', desc: 'Soft delete with 30-second undo window in notification toast.' },
  { title: 'Add loading skeletons for dashboard', priority: 'low', desc: 'Replace spinner with skeleton components matching layout.' },
  { title: 'Improve error messages for API responses', priority: 'low', desc: 'Standardize error format across all endpoints.' },
  { title: 'Pay AWS invoice for September', priority: 'high', desc: 'EC2, RDS, and S3 charges due. Approve and process payment.' },
  { title: 'Schedule performance reviews with team', priority: 'high', desc: 'Book 30-min slots for each team member for quarterly review.' },
  { title: 'Buy domain renewals for company sites', priority: 'high', desc: '3 domains expiring next month. Renew for 2 years.' },
  { title: 'Submit expense reports for conference trip', priority: 'medium', desc: 'Travel, hotel, and meal receipts from ReactConf 2025.' },
  { title: 'Prepare monthly OKR progress deck', priority: 'medium', desc: 'Slide deck showing key results progress for leadership meeting.' },
  { title: 'Plan team building event for October', priority: 'medium', desc: 'Coordinate with HR for venue, activities, and budget.' },
  { title: 'Research AI model comparison for v3', priority: 'medium', desc: 'Compare GPT-4o, Claude 3.5, and Grok 4.3 for our use case.' },
  { title: 'Fix calendar timezone offset bug', priority: 'medium', desc: 'Events showing wrong time for users in GMT+5:30 and PST.' },
  { title: 'Add pagination to notifications list', priority: 'low', desc: 'Implement cursor-based pagination for notification endpoint.' },
  { title: 'Update README with new architecture diagrams', priority: 'low', desc: 'Mermaid diagrams need updating to reflect current service architecture.' },
  { title: 'Design new logo and branding assets', priority: 'low', desc: 'Work with designer on updated logo variations for dark/light themes.' },
]

const realGoals = [
  { title: 'Ship v2.0 of FlowSync AI by end of quarter', desc: 'Complete all planned features, QA, and deployment for major version release.', targetDays: 45, progress: 72 },
  { title: 'Achieve 90% test coverage on backend', desc: 'Write unit and integration tests for all controllers, services, and middleware.', targetDays: 30, progress: 55 },
  { title: 'Reduce AWS monthly cost by 20%', desc: 'Optimize EC2 instances, use reserved pricing, clean up unused resources.', targetDays: 60, progress: 35 },
  { title: 'Publish 4 technical blog posts this quarter', desc: 'Write about AI integration, system architecture, performance optimization, and lessons learned.', targetDays: 50, progress: 50 },
  { title: 'Complete AWS Solutions Architect certification', desc: 'Study for and pass the AWS SAA-C03 exam.', targetDays: 90, progress: 25 },
  { title: 'Read 6 engineering books this year', desc: 'Focus on distributed systems, system design, and clean architecture.', targetDays: 120, progress: 40 },
]

const realHabits = [
  { title: 'Morning meditation', frequency: 'daily', trackedDays: 24 },
  { title: 'Exercise / Workout', frequency: 'daily', trackedDays: 20 },
  { title: 'Read 20 pages', frequency: 'daily', trackedDays: 22 },
  { title: 'Drink 8 glasses of water', frequency: 'daily', trackedDays: 26 },
  { title: 'Review weekly goals (Sunday)', frequency: 'weekly', trackedDays: 4 },
  { title: 'Code outside work hours', frequency: 'daily', trackedDays: 15 },
  { title: 'Write in journal', frequency: 'daily', trackedDays: 18 },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    })
    console.log('Connected to MongoDB')

    // Clean existing test user data
    const existing = await User.findOne({ email: TEST_EMAIL })
    if (existing) {
      await Promise.all([
        Task.deleteMany({ user: existing._id }),
        Goal.deleteMany({ user: existing._id }),
        Habit.deleteMany({ user: existing._id }),
        Notification.deleteMany({ user: existing._id }),
        User.findByIdAndDelete(existing._id),
      ])
      console.log('Cleaned existing test user data')
    }

    // Create user
    const user = await User.create({
      name: 'Test User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      bio: 'Software engineer and productivity enthusiast. Testing FlowSync AI for QA validation.',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      jobTitle: 'Senior Software Engineer',
    })
    console.log(`Created user: ${user.email}`)

    // === TASKS ===
    const tasks = []
    let completedCount = 0
    let pendingCount = 0
    let overdueCount = 0

    for (let i = 0; i < realTasks.length; i++) {
      const t = realTasks[i]
      const daysOffset = Math.floor(i / 3)
      const isOverdue = i < 7
      const isCompleted = i >= 7 && i < 22
      const isInProgress = i >= 22 && i < 28
      const isPending = i >= 28

      let status, deadline, createdAt, completedAt

      if (isOverdue) {
        status = randomItem(['todo', 'in_progress'])
        deadline = daysAgo(daysOffset + 1)
        createdAt = daysAgo(daysOffset + 5)
        overdueCount++
      } else if (isCompleted) {
        status = 'done'
        deadline = daysAgo(daysOffset - 3)
        createdAt = daysAgo(daysOffset + 8)
        completedAt = daysAgo(daysOffset - 1)
        completedCount++
      } else if (isInProgress) {
        status = 'in_progress'
        deadline = daysFromNow(7 - (i - 22))
        createdAt = daysAgo(5)
        pendingCount++
      } else {
        status = 'todo'
        deadline = daysFromNow(14 + (i - 28))
        createdAt = daysAgo(3)
        pendingCount++
      }

      const task = await Task.create({
        user: user._id,
        title: t.title,
        description: t.desc,
        priority: t.priority,
        status,
        deadline,
        createdAt,
        updatedAt: status === 'done' ? completedAt : createdAt,
      })
      tasks.push(task)
    }

    const totalTasks = tasks.length
    const overdueReal = tasks.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== 'done').length
    console.log(`Created ${totalTasks} tasks (${completedCount} completed, ${pendingCount} pending, ${overdueReal} overdue)`)

    // === GOALS ===
    const goals = []
    for (const g of realGoals) {
      const goal = await Goal.create({
        user: user._id,
        title: g.title,
        description: g.desc,
        targetDate: daysFromNow(g.targetDays),
        progress: g.progress,
        status: 'active',
      })
      goals.push(goal)
    }
    console.log(`Created ${goals.length} goals`)

    // === HABITS ===
    const habits = []
    for (const h of realHabits) {
      const logs = []
      const daysToTrack = h.trackedDays
      for (let d = 0; d < daysToTrack; d++) {
        const isDaily = h.frequency === 'daily'
        const isWeekly = h.frequency === 'weekly'
        const date = daysAgo(d)
        if (isDaily) {
          logs.push(date.toISOString().split('T')[0])
        } else if (isWeekly && date.getDay() === 0) {
          logs.push(date.toISOString().split('T')[0])
        }
      }

      const habit = await Habit.create({
        user: user._id,
        title: h.title,
        frequency: h.frequency,
        streak: h.trackedDays,
        lastChecked: daysAgo(0),
        logs,
        status: 'active',
      })
      habits.push(habit)
    }
    console.log(`Created ${habits.length} habits`)

    // === NOTIFICATIONS ===
    const notificationData = [
      { title: 'Task Overdue: Q3 Financial Report', message: 'Your task "Complete Q3 financial report" is now overdue. Immediate attention required.', type: 'deadline_alert' },
      { title: 'AI Suggestion: Prioritize Fix Production Bug', message: 'Based on urgency analysis, "Fix payment gateway timeout" should be your top priority today.', type: 'ai_suggestion' },
      { title: 'Reminder: Team Standup in 15 minutes', message: 'Daily standup at 9:30 AM. Be prepared with your update.', type: 'reminder' },
      { title: 'Goal Progress: Test Coverage at 55%', message: 'You are making progress on the test coverage goal. Keep up the momentum!', type: 'system' },
      { title: 'AI Suggestion: Rescue Mode Recommended', message: 'You have 5 tasks due within 48 hours. Consider using Rescue Mode to reorganize.', type: 'ai_suggestion' },
      { title: 'Deadline Alert: AWS Invoice Due Tomorrow', message: 'Payment for AWS September invoice is due tomorrow.', type: 'deadline_alert' },
      { title: 'Habit Streak: Meditation at 24 days', message: 'Congratulations! You have maintained your meditation streak for 24 days.', type: 'system' },
      { title: 'Reminder: Weekly Goal Review', message: 'Sunday goal review reminder. Take 15 minutes to plan your week.', type: 'reminder' },
      { title: 'AI Suggestion: Daily Plan Generated', message: 'Your optimized schedule for today is ready. Check AI Planner for details.', type: 'ai_suggestion' },
      { title: 'System: Backup Completed Successfully', message: 'Daily database backup completed. Size: 2.4 GB.', type: 'system' },
      { title: 'Deadline Alert: Performance Reviews This Week', message: 'Schedule quarterly reviews with your team by Friday.', type: 'deadline_alert' },
      { title: 'AI Suggestion: Deploy Hotfix Soon', message: 'The login redirect hotfix has been open for 3 days. Consider deploying today.', type: 'ai_suggestion' },
    ]

    const notifications = []
    for (let i = 0; i < notificationData.length; i++) {
      const n = notificationData[i]
      const notif = await Notification.create({
        user: user._id,
        type: n.type,
        title: n.title,
        message: n.message,
        status: i < 5 ? 'unread' : randomItem(['unread', 'read']),
        createdAt: daysAgo(i),
      })
      notifications.push(notif)
    }
    console.log(`Created ${notifications.length} notifications`)

    console.log('\n========== SEED COMPLETE ==========')
    console.log(`Email:    ${TEST_EMAIL}`)
    console.log(`Password: ${TEST_PASSWORD}`)
    console.log(`Tasks:    ${totalTasks}`)
    console.log(`  Completed: ${completedCount}`)
    console.log(`  Pending:   ${pendingCount}`)
    console.log(`  Overdue:   ${overdueReal}`)
    console.log(`Goals:    ${goals.length}`)
    console.log(`Habits:   ${habits.length}`)
    console.log(`Notif:    ${notifications.length}`)
    console.log('====================================\n')

    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
