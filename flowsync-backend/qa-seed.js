// QA Seed Script — creates realistic test data via Railway API
const API = 'https://flowsync-ai-production.up.railway.app'
const TEST_EMAIL = 'test@flowsync.ai'
const TEST_PASSWORD = 'Test@123456'

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)
  if (token) opts.headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} — ${JSON.stringify(data)}`)
  return data
}

function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString()
}

function daysFromNow(n) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString()
}

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const realTasks = [
  { title: 'Complete Q3 financial report for board meeting', priority: 'high', desc: 'Prepare revenue analysis, expense breakdown, and growth projections for quarterly board presentation.' },
  { title: 'Review pull requests on authentication module', priority: 'high', desc: 'Review 3 open PRs related to OAuth2 implementation and session management.' },
  { title: 'Fix production bug: payment gateway timeout', priority: 'high', desc: 'Users reporting 504 errors during checkout. Investigate Stripe integration.' },
  { title: 'Prepare client proposal for Acme Corp', priority: 'high', desc: 'Scope of work, timeline, pricing for enterprise onboarding project.' },
  { title: 'Deploy hotfix for login redirect issue', priority: 'high', desc: 'Production hotfix — login redirects to blank page on Safari.' },
  { title: 'Pay AWS invoice for September', priority: 'high', desc: 'EC2, RDS, and S3 charges due. Approve and process payment.' },
  { title: 'Schedule performance reviews with team', priority: 'high', desc: 'Book 30-min slots for each team member for quarterly review.' },
  { title: 'Design system migration — update button component', priority: 'medium', desc: 'Migrate all Button variants to new design tokens per Figma v3.' },
  { title: 'Write unit tests for task controller', priority: 'medium', desc: 'Cover create, update, delete, and edge cases for task controller.' },
  { title: 'Optimize MongoDB aggregate queries', priority: 'medium', desc: 'Analytics page loading slow. Add indexes and optimize pipeline stages.' },
  { title: 'Set up CI/CD pipeline for staging environment', priority: 'medium', desc: 'Configure GitHub Actions for auto-deploy to staging on PR merge.' },
  { title: 'Update API documentation for v2 endpoints', priority: 'medium', desc: 'Document new analytics and AI endpoints with request/response examples.' },
  { title: 'Refactor notification service to use observer pattern', priority: 'medium', desc: 'Current implementation tightly coupled. Decouple for better testability.' },
  { title: 'Database backup strategy documentation', priority: 'medium', desc: 'Document backup schedule, retention policy, and restore procedure.' },
  { title: 'Accessibility audit — keyboard navigation', priority: 'medium', desc: 'Ensure all interactive elements are reachable and operable via keyboard.' },
  { title: 'Implement rate limiting for AI endpoints', priority: 'medium', desc: 'Prevent abuse of AI API by implementing token bucket algorithm.' },
  { title: 'Submit expense reports for conference trip', priority: 'medium', desc: 'Travel, hotel, and meal receipts from ReactConf 2025.' },
  { title: 'Prepare monthly OKR progress deck', priority: 'medium', desc: 'Slide deck showing key results progress for leadership meeting.' },
  { title: 'Plan team building event for October', priority: 'medium', desc: 'Coordinate with HR for venue, activities, and budget.' },
  { title: 'Research AI model comparison for v3', priority: 'medium', desc: 'Compare GPT-4o, Claude 3.5, and Grok 4.3 for AI productivity use case.' },
  { title: 'Fix calendar timezone offset bug', priority: 'medium', desc: 'Events showing wrong time for users in GMT+5:30 and PST timezones.' },
  { title: 'Buy domain renewals for company sites', priority: 'high', desc: '3 domains expiring next month. Renew for 2 years with automatic renewal.' },
  { title: 'Review team code for security vulnerabilities', priority: 'medium', desc: 'Scan for OWASP Top 10 issues in recent commits across all repos.' },
  { title: 'Update dependencies to latest versions', priority: 'low', desc: 'Review npm audit and update all packages to latest compatible versions.' },
  { title: 'Add dark mode support for charts', priority: 'low', desc: 'Chart.js configuration update for dark theme color scheme across all chart types.' },
  { title: 'Create onboarding tutorial screens', priority: 'low', desc: 'Design and implement 4-step interactive onboarding flow for new users.' },
  { title: 'Write blog post about AI productivity integration', priority: 'low', desc: 'Draft engineering blog post about integrating Grok AI into a MERN stack.' },
  { title: 'Add export tasks to CSV feature', priority: 'low', desc: 'Allow users to export filtered task lists and analytics as CSV files.' },
  { title: 'Implement undo delete for tasks', priority: 'low', desc: 'Soft delete with 30-second undo window shown in notification toast.' },
  { title: 'Add loading skeletons for dashboard widgets', priority: 'low', desc: 'Replace spinner with skeleton components that match widget layout.' },
  { title: 'Improve standardized error messages for API', priority: 'low', desc: 'Standardize error format across all API endpoints for better DX.' },
  { title: 'Add pagination to notifications list endpoint', priority: 'low', desc: 'Implement cursor-based pagination for notification endpoint.' },
  { title: 'Update README with new architecture diagrams', priority: 'low', desc: 'Mermaid diagrams need updating to reflect the current service architecture.' },
  { title: 'Design new logo and branding asset variations', priority: 'low', desc: 'Work with designer on updated logo variations optimized for dark and light themes.' },
  { title: 'Dashboard performance optimization and caching', priority: 'medium', desc: 'Reduce API calls on dashboard load by implementing Redis caching layer.' },
]

async function seed() {
  console.log('=== FLOWSYNC AI QA SEED ===\n')

  // 1. Clean existing test user
  try {
    const existing = await req('POST', '/api/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD })
    console.log('Existing user found. Token obtained.')
    // Try to delete account
    try {
      await req('DELETE', '/api/settings/account', null, existing.token)
      console.log('Deleted existing user data.')
    } catch (e) {
      console.log('Could not delete via API (expected if fresh).')
    }
  } catch (e) {
    console.log('No existing user. Creating fresh.\n')
  }

  // 2. Signup
  const signup = await req('POST', '/api/auth/signup', { name: 'Test User', email: TEST_EMAIL, password: TEST_PASSWORD })
  const token = signup.token
  const userId = signup.user._id
  console.log(`✓ Created user: ${TEST_EMAIL} (ID: ${userId})`)

  // Update profile
  await req('PUT', '/api/settings/profile', {
    name: 'Test User',
    bio: 'Senior software engineer and productivity enthusiast. Testing FlowSync AI for end-to-end QA validation across all features.',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    jobTitle: 'Senior Software Engineer',
  }, token)
  console.log('✓ Profile updated')

  // === 3. CREATE TASKS ===
  let completedCount = 0, pendingCount = 0, overdueCount = 0
  const createdTaskIds = []

  for (let i = 0; i < realTasks.length; i++) {
    const t = realTasks[i]
    let status, deadline

    if (i < 7) {
      // Overdue
      status = i % 2 === 0 ? 'todo' : 'in_progress'
      deadline = daysAgo(Math.floor(i / 1.5) + 1)
      overdueCount++
    } else if (i < 22) {
      // Completed
      status = 'done'
      deadline = daysAgo(i - 5)
      completedCount++
    } else if (i < 28) {
      // In progress
      status = 'in_progress'
      deadline = daysFromNow(14 - (i - 22))
      pendingCount++
    } else {
      // Pending
      status = 'todo'
      deadline = daysFromNow(21 + (i - 28))
      pendingCount++
    }

    const task = await req('POST', '/api/tasks', {
      title: t.title,
      description: t.desc,
      priority: t.priority,
      status,
      deadline,
    }, token)
    createdTaskIds.push(task._id)
  }

  const totalTasks = createdTaskIds.length
  console.log(`✓ ${totalTasks} tasks created (${completedCount} done, ${pendingCount} pending, ${overdueCount} overdue)`)

  // === 4. CREATE GOALS ===
  const goals = [
    { title: 'Ship v2.0 of FlowSync AI by end of quarter', desc: 'Complete all planned features, QA testing, and production deployment for the major version release.', targetDays: 45, progress: 72 },
    { title: 'Achieve 90% test coverage on backend services', desc: 'Write comprehensive unit and integration tests for all controllers, services, and middleware layers.', targetDays: 30, progress: 55 },
    { title: 'Reduce AWS monthly infrastructure cost by 20%', desc: 'Optimize EC2 instance types, use reserved pricing, and clean up unused resources and snapshots.', targetDays: 60, progress: 35 },
    { title: 'Publish 4 technical blog posts this quarter', desc: 'Write about AI integration, system architecture decisions, performance optimization, and engineering lessons learned.', targetDays: 50, progress: 50 },
    { title: 'Complete AWS Solutions Architect certification', desc: 'Study for and pass the AWS SAA-C03 certification exam with focus on distributed systems.', targetDays: 90, progress: 25 },
    { title: 'Read 6 engineering books this calendar year', desc: 'Focus on distributed systems, system design patterns, and clean architecture principles.', targetDays: 120, progress: 40 },
  ]

  for (const g of goals) {
    await req('POST', '/api/goals', {
      title: g.title,
      description: g.desc,
      targetDate: daysFromNow(g.targetDays),
      progress: g.progress,
      status: 'active',
    }, token)
  }
  console.log(`✓ ${goals.length} goals created`)

  // === 5. CREATE HABITS ===
  const habits = [
    { title: 'Morning meditation', frequency: 'daily' },
    { title: 'Exercise / Workout', frequency: 'daily' },
    { title: 'Read 20 pages of a book', frequency: 'daily' },
    { title: 'Drink 8 glasses of water', frequency: 'daily' },
    { title: 'Review goals every Sunday', frequency: 'weekly' },
    { title: 'Code on side project', frequency: 'daily' },
    { title: 'Write in journal', frequency: 'daily' },
  ]

  for (const h of habits) {
    await req('POST', '/api/habits', {
      title: h.title,
      frequency: h.frequency,
      status: 'active',
    }, token)
  }
  console.log(`✓ ${habits.length} habits created`)

  // === 6. CREATE NOTIFICATIONS ===
  const notifs = [
    { type: 'deadline_alert', title: 'Task Overdue: Q3 Financial Report', message: 'Your task "Complete Q3 financial report" is now overdue by 2 days. Immediate attention required.', status: 'unread' },
    { type: 'ai_suggestion', title: 'AI Suggestion: Prioritize Production Bug Fix', message: 'Based on urgency analysis, "Fix payment gateway timeout" should be your top priority today.', status: 'unread' },
    { type: 'reminder', title: 'Team Standup in 15 minutes', message: 'Daily standup at 9:30 AM. Be prepared with your update on progress and blockers.', status: 'unread' },
    { type: 'system', title: 'Goal Progress: 55% Test Coverage', message: 'You are making steady progress on the test coverage goal. Keep up the momentum!', status: 'unread' },
    { type: 'ai_suggestion', title: 'Rescue Mode Recommended', message: 'You have 5 tasks due within 48 hours. Consider using Rescue Mode to reorganize your overloaded schedule.', status: 'unread' },
    { type: 'deadline_alert', title: 'AWS Invoice Due Tomorrow', message: 'Payment for AWS September invoice ($2,847.32) is due tomorrow by end of day.', status: 'unread' },
    { type: 'system', title: 'Meditation Streak: 24 Days', message: 'Congratulations! You have maintained your meditation streak for 24 consecutive days.', status: 'unread' },
    { type: 'reminder', title: 'Weekly Goal Review Reminder', message: 'Sunday goal review time. Take 15 minutes to plan your week ahead and track progress.', status: 'read' },
    { type: 'ai_suggestion', title: 'Daily Plan Ready for Review', message: 'Your optimized schedule for today has been generated. Check AI Planner for detailed time blocks.', status: 'read' },
    { type: 'system', title: 'Database Backup Completed', message: 'Daily encrypted backup completed successfully. Total size: 2.4 GB. Retention: 30 days.', status: 'read' },
    { type: 'deadline_alert', title: 'Performance Reviews Due This Week', message: 'Quarterly performance reviews must be scheduled and completed by Friday.', status: 'read' },
    { type: 'ai_suggestion', title: 'Deploy Login Hotfix Soon', message: 'The Safari login redirect hotfix has been open for 3 days. Consider deploying to production today.', status: 'read' },
  ]

  for (const n of notifs) {
    await req('POST', '/api/notifications', {
      type: n.type,
      title: n.title,
      message: n.message,
      status: n.status,
    }, token)
  }
  console.log(`✓ ${notifs.length} notifications created`)

  // === 7. TEST ANALYTICS ===
  try {
    const stats = await req('GET', '/api/analytics/stats', null, token)
    console.log(`✓ Analytics stats: ${stats.total} total tasks, ${stats.done} done, ${stats.completionRate}% rate`)
  } catch (e) {
    console.log(`⚠ Analytics stats error: ${e.message}`)
  }

  try {
    const weekly = await req('GET', '/api/analytics/weekly', null, token)
    console.log(`✓ Weekly analytics: ${weekly.totalTasks} tasks, ${weekly.completionRate}% rate`)
  } catch (e) {
    console.log(`⚠ Weekly analytics error: ${e.message}`)
  }

  try {
    const monthly = await req('GET', '/api/analytics/monthly', null, token)
    console.log(`✓ Monthly analytics: ${monthly.totalTasks} tasks, ${monthly.completionRate}% rate`)
  } catch (e) {
    console.log(`⚠ Monthly analytics error: ${e.message}`)
  }

  // === 8. TEST TASK OPERATIONS ===
  if (createdTaskIds.length > 0) {
    try {
      const firstTaskId = createdTaskIds[0]
      await req('PUT', `/api/tasks/${firstTaskId}`, { title: '[UPDATED] ' + realTasks[0].title }, token)
      console.log('✓ Task update works')

      const tasks = await req('GET', '/api/tasks', null, token)
      console.log(`✓ Task list: ${tasks.length} tasks`)
    } catch (e) {
      console.log(`⚠ Task operations error: ${e.message}`)
    }
  }

  // === 9. TEST SETTINGS ===
  try {
    const profile = await req('GET', '/api/settings/profile', null, token)
    console.log(`✓ Profile: ${profile.name}, ${profile.jobTitle}, ${profile.location}`)
  } catch (e) {
    console.log(`⚠ Settings error: ${e.message}`)
  }

  // === 10. TEST AI SUGGEST TASK ===
  try {
    const suggestion = await req('POST', '/api/ai/suggest-task', { title: 'Prepare quarterly report for board meeting' }, token)
    console.log(`✓ AI suggest-task: priority=${suggestion.suggestedPriority}, tags=${suggestion.suggestedTags?.join(',') || 'none'}`)
  } catch (e) {
    console.log(`⚠ AI suggest-task error: ${e.message}`)
  }

  // === 12. TEST AI USAGE ===
  try {
    const usage = await req('GET', '/api/ai/usage', null, token)
    console.log(`✓ AI usage: ${usage.used}/${usage.limit} today`)
  } catch (e) {
    console.log(`⚠ AI usage error: ${e.message}`)
  }

  // === 13. TEST CHAT HISTORY ===
  try {
    const aiResp = await req('POST', '/api/ai/chat', { message: 'What are my top priorities today?' }, token)
    console.log(`✓ AI chat works! Reply: "${aiResp.reply?.slice(0, 80)}..."`)
  } catch (e) {
    console.log(`⚠ AI chat error: ${e.message}`)
  }

  try {
    const sessions = await req('GET', '/api/chat/sessions', null, token)
    console.log(`✓ Chat sessions: ${sessions.length} session(s)`)
  } catch (e) {
    console.log(`⚠ Chat sessions error: ${e.message}`)
  }

  // === 14. TEST NOTIFICATION READ ===
  try {
    const notifs = await req('GET', '/api/notifications', null, token)
    if (notifs.length > 0) {
      await req('PUT', `/api/notifications/${notifs[0]._id}/read`, null, token)
      console.log('✓ Notification mark-read works')
    }
  } catch (e) {
    console.log(`⚠ Notification error: ${e.message}`)
  }

  console.log('\n=== ✅ QA SEED COMPLETE ===')
  console.log(`🔑 Email:      ${TEST_EMAIL}`)
  console.log(`🔑 Password:   ${TEST_PASSWORD}`)
  console.log(`📊 Tasks:      ${totalTasks} (${completedCount} done, ${pendingCount} pending, ${overdueCount} overdue)`)
  console.log(`🎯 Goals:      ${goals.length}`)
  console.log(`🔄 Habits:     ${habits.length}`)
  console.log(`🔔 Notifs:     ${notifs.length}`)
  console.log('============================')
}

seed().catch(err => {
  console.error('\n❌ SEED FAILED:', err.message)
  process.exit(1)
})
