import { test, expect } from '@playwright/test'
import { signupUser, createTask, seedSession, todayKey } from './helpers'

test.describe('Dashboard undo delete', () => {
  test('deleting a task shows undo and Undo restores it via server', async ({ page, request }) => {
    const session = await signupUser(request)
    await createTask(request, session.token, { title: 'Undo Me', deadline: `${todayKey()}T10:00:00.000Z` })
    await seedSession(page, session)

    await page.goto('/dashboard')
    await expect(page.getByText('Undo Me').first()).toBeVisible()

    await page.getByRole('button', { name: 'Delete Undo Me' }).click()
    await expect(page.getByText('Task deleted')).toBeVisible()

    await page.getByRole('button', { name: 'Undo', exact: true }).click()

    await expect(page.getByText('Undo Me').first()).toBeVisible({ timeout: 10000 })

    const res = await request.get(`${process.env.E2E_API || 'http://localhost:5000'}/api/tasks`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const tasks = await res.json()
    expect(tasks.some(t => t.title === 'Undo Me')).toBeTruthy()
  })
})
