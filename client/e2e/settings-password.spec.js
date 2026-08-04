import { test, expect } from '@playwright/test'
import { signupUser, seedSession, API_BASE } from './helpers'

test.describe('Settings password change', () => {
  test('changing password rejects old password and accepts new', async ({ page, request }) => {
    const session = await signupUser(request)
    const oldPassword = session.password
    const newPassword = 'NewPass123!'
    await seedSession(page, session)

    await page.goto('/profile')
    await page.getByRole('button', { name: 'Password' }).click()
    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible()

    await page.getByPlaceholder('Enter current password').fill(oldPassword)
    await page.getByPlaceholder('Enter new password', { exact: true }).fill(newPassword)
    await page.getByPlaceholder('Re-enter new password').fill(newPassword)
    await page.getByRole('button', { name: 'Update Password' }).click()

    await expect(page.getByText('Password changed successfully')).toBeVisible({ timeout: 10000 })

    const oldLogin = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: session.email, password: oldPassword },
    })
    expect(oldLogin.status()).toBe(401)

    const newLogin = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: session.email, password: newPassword },
    })
    expect(newLogin.status()).toBe(200)
  })
})
