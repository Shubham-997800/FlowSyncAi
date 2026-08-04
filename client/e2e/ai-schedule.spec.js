import { test, expect } from '@playwright/test'
import { signupUser, createTask, seedSession, todayKey } from './helpers'

test.describe('AI Schedule flow', () => {
  test('AI schedule refreshes task preview after optimization', async ({ page, request }) => {
    const session = await signupUser(request)
    await createTask(request, session.token, { deadline: `${todayKey()}T10:00:00.000Z`, priority: 'high' })
    await seedSession(page, session)

    await page.goto('/calendar')
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible()

    await expect(page.getByText('E2E Task').first()).toBeVisible()

    await page.waitForTimeout(1200)

    const aiButton = page.getByRole('button', { name: 'AI Schedule' })
    await expect(aiButton).toBeVisible()
    await aiButton.click({ force: true })

    await expect(page.getByRole('button', { name: /Optimizing/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Optimizing/ })).toBeHidden({ timeout: 15000 })

    await expect(page.getByText('AI Preview')).toBeVisible()
    await expect(page.getByText('E2E Task').first()).toBeVisible()
  })
})
