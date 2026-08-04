import { test, expect } from '@playwright/test'
import { signupUser, seedSession, API_BASE } from './helpers'

test.describe('Goals flow', () => {
  test('create a goal and update its progress', async ({ page, request }) => {
    const session = await signupUser(request)
    await seedSession(page, session)

    await page.goto('/tasks')
    await expect(page.getByRole('heading', { name: 'Tasks & Goals', level: 1 })).toBeVisible()

    await page.getByRole('button', { name: 'Goals' }).click()
    await page.getByRole('button', { name: 'Add Goal' }).click()
    await page.getByPlaceholder('Enter goal title').fill('Ship V2')
    await page.getByRole('button', { name: 'Create Goal' }).click()

    await expect(page.getByText('Ship V2').first()).toBeVisible({ timeout: 10000 })

    const res = await request.get(`${API_BASE}/api/goals`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const goals = await res.json()
    const goal = goals.find(g => g.title === 'Ship V2')
    expect(goal).toBeTruthy()

    const updated = await request.put(`${API_BASE}/api/goals/${goal._id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      data: { progress: 50 },
    })
    expect(updated.status()).toBe(200)

    const again = await request.get(`${API_BASE}/api/goals`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const after = (await again.json()).find(g => g.title === 'Ship V2')
    expect(after.progress).toBe(50)
  })
})
