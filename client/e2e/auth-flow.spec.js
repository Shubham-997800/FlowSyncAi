import { test, expect } from '@playwright/test'
import { API_BASE } from './helpers'

test.describe('Auth flow', () => {
  test('signup -> logout -> login roundtrip', async ({ page, request }) => {
    const email = `auth-${Date.now()}@test.com`
    const password = 'Password123!'

    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /Start Organizing Smarter/, level: 1 })).toBeVisible()

    await page.getByLabel('Full Name', { exact: true }).fill('Auth User')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByLabel('Confirm Password', { exact: true }).fill(password)
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Create Account' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
    await expect(page.getByText('Auth User').first()).toBeVisible()

    const onboarding = page.getByRole('button', { name: "Got it, let's go" })
    if (await onboarding.count()) await onboarding.click()

    await page.getByRole('button', { name: 'Log out' }).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /Welcome Back/, level: 1 })).toBeVisible()

    await page.getByLabel('Email Address', { exact: true }).fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
    await expect(page.getByText('Auth User').first()).toBeVisible()

    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email, password },
    })
    expect(res.status()).toBe(200)
  })
})
