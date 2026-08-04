import { test, expect } from '@playwright/test'
import { signupUser, seedSession, API_BASE } from './helpers'

test.describe('Habits flow', () => {
  test('create a habit and toggle it done today', async ({ page, request }) => {
    const session = await signupUser(request)
    await seedSession(page, session)

    await page.goto('/habits')
    await expect(page.getByRole('heading', { name: 'Habits' })).toBeVisible()

    await page.getByRole('button', { name: 'Add Habit' }).click()
    await page.getByPlaceholder('e.g., Morning workout').fill('Drink Water')
    await page.getByRole('button', { name: 'Create Habit' }).click()

    await expect(page.getByText('Drink Water').first()).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: 'Mark Drink Water as done' }).click()

    await expect(page.getByText('Drink Water').first()).toHaveClass(/.+line-through/, { timeout: 10000 })

    const res = await request.get(`${API_BASE}/api/habits`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    const habits = await res.json()
    expect(habits.some(h => h.title === 'Drink Water')).toBeTruthy()
  })
})
