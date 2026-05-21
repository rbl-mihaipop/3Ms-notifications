import { test, expect } from '@playwright/test';

test.describe('Priority 3 — Expired Project Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
  });

  test('app loads and shows notification page', async ({ page }) => {
    await expect(page.getByText('Notifications').first()).toBeVisible();
  });

  test('bell badge shows unread count', async ({ page }) => {
    const badge = page.getByTestId('notification-badge');
    await expect(badge).toBeVisible();
    const count = await badge.textContent();
    expect(Number(count)).toBeGreaterThan(0);
  });

  test('Action Required tab shows overdue project notifications', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    const subtypeLabels = page.getByTestId('notification-subtype');
    await expect(subtypeLabels.first()).toHaveText('PAST CLOSING DATE');
    const cards = page.getByTestId('notification-card');
    await expect(cards).toHaveCount(2);
  });

  test('overdue notification cards show correct entity info', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    await expect(page.getByText('Bucharest Office Tower').first()).toBeVisible();
    await expect(page.getByText('Timișoara Retail Park').first()).toBeVisible();
  });

  test('"Review project" CTA is present and clickable', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    const cta = page.getByTestId('notification-cta').first();
    await expect(cta).toContainText(/review project/i);
    await cta.click();
  });

  test('clicking card marks notification as read and decrements badge', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    const badgeBefore = Number(await page.getByTestId('notification-badge').textContent());
    await page.getByTestId('notification-card').first().click();
    const badgeAfter = Number(await page.getByTestId('notification-badge').textContent());
    expect(badgeAfter).toBeLessThan(badgeBefore);
  });

  test('"Mark all as read" clears badge', async ({ page }) => {
    await page.getByRole('button', { name: /mark all as read/i }).click();
    // MUI Badge hides the indicator span when badgeContent is null
    await expect(
      page.getByTestId('notification-badge').locator('.MuiBadge-badge'),
    ).not.toBeVisible();
  });
});
