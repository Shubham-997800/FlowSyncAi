import { test, expect } from '@playwright/test'
import { signupUser, seedSession, API_BASE } from './helpers'

test.describe('Notifications mark as read', () => {
  test('marking a notification read removes it from unread state', async ({ page, request }) => {
    const session = await signupUser(request)
    const create = await request.post(`${API_BASE}/api/notifications`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: { type: 'system', title: 'Standup Reminder', message: 'Daily standup at 10am' },
    })
    expect(create.status()).toBe(201)
    await seedSession(page, session)

    await page.goto('/notifications')
    await expect(page.getByText('Standup Reminder')).toBeVisible()

    await page.getByRole('button', { name: 'Mark Standup Reminder as read' }).click()

    await expect(page.getByRole('button', { name: 'Mark Standup Reminder as read' })).toBeHidden()
    await expect(page.getByText('1 new')).toBeHidden()

    const res = await request.get(`${API_BASE}/api/notifications`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const items = await res.json()
    expect(items.every(n => n.status === 'read')).toBeTruthy()
  })
})
