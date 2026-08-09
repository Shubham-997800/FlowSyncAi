import { test, expect } from '@playwright/test'
import { signupUser, createTask, seedSession, todayKey } from './helpers'

test.describe('Tasks', () => {
  test('seeded task shows on the dashboard and can be marked done', async ({ page, request }) => {
    const session = await signupUser(request)
    const title = `E2E Task ${Date.now()}`
    await createTask(request, session.token, { title, deadline: `${todayKey()}T10:00:00.000Z`, priority: 'high' })
    await seedSession(page, session)

    await page.goto('/dashboard')
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 15000 })

    // Today's Tasks renders a "Mark <title> done" toggle; completing it removes
    // the task from the remaining list (server round-trip via updateTask).
    await page.getByRole('button', { name: `Mark ${title} done` }).click()
    await expect(page.getByRole('button', { name: `Mark ${title} done` })).toBeHidden({ timeout: 10000 })

    const res = await request.get(`${process.env.E2E_API || 'http://localhost:5000'}/api/tasks`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const tasks = await res.json()
    const task = tasks.find(t => t.title === title)
    expect(task).toBeTruthy()
    expect(task.status).toBe('done')
  })
})
