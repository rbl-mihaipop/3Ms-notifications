import { test, expect } from '@playwright/test';

test.describe('Tab navigation and content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
  });

  test('default tab is Action Required', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /action required/i })).toHaveAttribute('aria-selected', 'true');
  });

  test('tab count badges show correct totals', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /action required/i })).toContainText('3');
    await expect(page.getByRole('tab', { name: /new reports/i })).toContainText('3');
    await expect(page.getByRole('tab', { name: /updates/i })).toContainText('4');
  });

  test('Action Required tab shows 3 notification cards', async ({ page }) => {
    await expect(page.getByTestId('notification-card')).toHaveCount(3);
  });

  test('New Reports tab shows 3 notification cards', async ({ page }) => {
    await page.getByRole('tab', { name: /new reports/i }).click();
    await expect(page.getByTestId('notification-card')).toHaveCount(3);
  });

  test('Updates tab shows 4 notification cards', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await expect(page.getByTestId('notification-card')).toHaveCount(4);
  });

  test('switching tabs swaps CTA labels', async ({ page }) => {
    await page.getByRole('tab', { name: /new reports/i }).click();
    await expect(page.getByTestId('notification-cta').first()).toContainText(/view report/i);

    await page.getByRole('tab', { name: /action required/i }).click();
    await expect(page.getByTestId('notification-cta').first()).toContainText(/go to project/i);
  });

  test('sidebar badge shows initial unread count of 10', async ({ page }) => {
    await expect(page.getByTestId('notification-badge')).toHaveText('10');
  });

  test('sidebar badge disappears after mark all as read', async ({ page }) => {
    await page.getByRole('button', { name: /mark all as read/i }).click();
    await expect(page.getByTestId('notification-badge')).not.toBeVisible();
  });

  test('"Mark all as read" button disappears when no unread remain', async ({ page }) => {
    await page.getByRole('button', { name: /mark all as read/i }).click();
    await expect(page.getByRole('button', { name: /mark all as read/i })).not.toBeVisible();
  });

  test('TODAY date group is visible on Action Required tab', async ({ page }) => {
    // ntf-008 was created 2026-05-21, so it falls under TODAY
    await expect(page.getByText(/today/i).first()).toBeVisible();
  });

  test('YESTERDAY date group is visible on Action Required tab', async ({ page }) => {
    // ntf-009 was created 2026-05-20
    await expect(page.getByText('YESTERDAY')).toBeVisible();
  });

  test('amber banner is hidden on New Reports tab', async ({ page }) => {
    await page.getByRole('tab', { name: /new reports/i }).click();
    await expect(page.getByText(/clear automatically/i)).not.toBeVisible();
  });

  test('amber banner is hidden on Updates tab', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await expect(page.getByText(/clear automatically/i)).not.toBeVisible();
  });
});
