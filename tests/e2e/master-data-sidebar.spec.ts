import { test, expect } from '@playwright/test';

test.describe('Master Data sidebar navigation', () => {
  test('default route opens Master Data page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/master-data$/);
    await expect(page.getByRole('heading', { name: 'Master Data' })).toBeVisible();
  });

  test('sidebar only contains Master Data and Notifications nav items', async ({ page }) => {
    await page.goto('/master-data');
    await expect(page.getByRole('button', { name: 'Master Data' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await expect(page.getByText('Portfolio')).toHaveCount(0);
    await expect(page.getByText('Lifecycle')).toHaveCount(0);
    await expect(page.getByText('Investment planning')).toHaveCount(0);
    await expect(page.getByText('Expertise')).toHaveCount(0);
  });
});
