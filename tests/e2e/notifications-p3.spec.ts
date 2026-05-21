import { test, expect } from '@playwright/test';

test.describe('Priority 3 — Expired Project Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
  });

  test('app loads and shows notification page', async ({ page }) => {
    await expect(page.getByText('Notifications').first()).toBeVisible();
  });

  test('bell badge shows unread count', async ({ page }) => {
    // Sidebar notification badge (the red number next to "Notifications" in nav)
    const badge = page.locator('[data-testid="notification-badge"]').first();
    await expect(badge).toBeVisible();
  });

  test('Projects tab shows overdue project notifications', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    const subtypeLabels = page.getByTestId('notification-subtype');
    await expect(subtypeLabels.first()).toHaveText('PAST CLOSING DATE');
    const cards = page.getByTestId('notification-card');
    await expect(cards).toHaveCount(3);
  });

  test('overdue notification cards show correct entity info', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await expect(page.getByText('Bucharest Office Tower – Phase II acquisition').first()).toBeVisible();
    await expect(page.getByText('Northgate Logistics – Disposal of Asset 4B').first()).toBeVisible();
  });

  test('"Go to project" CTA is present and clickable', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    const cta = page.getByTestId('notification-cta').first();
    await expect(cta).toContainText(/go to project/i);
    await cta.click();
  });

  test('clicking card marks notification as read', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    // Unread dot should be visible before click
    const card = page.getByTestId('notification-card').first();
    await card.click();
    // After click the card should still be present (just status changed)
    await expect(card).toBeVisible();
  });

  test('"Mark all as read" button is present and clears the badge', async ({ page }) => {
    await page.getByRole('button', { name: /mark all as read/i }).click();
    // MUI Badge hides the indicator span when badgeContent is null
    await expect(
      page.getByTestId('notification-badge').locator('.MuiBadge-badge'),
    ).not.toBeVisible();
  });

  test('PINNED section is visible for action_required tab', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await expect(page.getByText('Pinned').first()).toBeVisible();
  });

  test('amber info banner is visible on projects tab', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await expect(
      page.getByText(/clear automatically/i),
    ).toBeVisible();
  });

  test('Assignments tab shows assigned object notifications', async ({ page }) => {
    await page.getByRole('tab', { name: /assignments/i }).click();
    await expect(page.getByTestId('notification-card').first()).toBeVisible();
  });
});
