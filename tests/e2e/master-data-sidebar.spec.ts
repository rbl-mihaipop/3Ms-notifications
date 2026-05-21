import { test, expect } from '@playwright/test';

test.describe('Master Data sidebar navigation', () => {
  test('default route redirects to Master Data page', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/master-data$/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Master Data' })).toBeVisible();
  });

  test('sidebar shows Master Data and Notifications as the only nav items', async ({ page }) => {
    await page.goto('/master-data');

    // ListItemButton renders as div[role="button"] in MUI — filter by contained text
    await expect(page.locator('[role="button"]').filter({ hasText: 'Master Data' }).first()).toBeVisible();
    await expect(page.locator('[role="button"]').filter({ hasText: 'Notifications' }).first()).toBeVisible();

    // Old nav sections from the previous sidebar must be gone — scoped to sidebar nav buttons only
    await expect(page.locator('[role="button"]').filter({ hasText: /^Portfolio$/ })).toHaveCount(0);
    await expect(page.locator('[role="button"]').filter({ hasText: /^Lifecycle$/ })).toHaveCount(0);
    await expect(page.locator('[role="button"]').filter({ hasText: /^Investment planning$/ })).toHaveCount(0);
    await expect(page.locator('[role="button"]').filter({ hasText: /^Expertise$/ })).toHaveCount(0);
  });

  test('Master Data page renders the buildings table', async ({ page }) => {
    await page.goto('/master-data');
    await expect(page.getByRole('heading', { name: 'Master Data' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'City' })).toBeVisible();
  });

  test('clicking Notifications nav item navigates to /notifications', async ({ page }) => {
    await page.goto('/master-data');
    await page.locator('[role="button"]').filter({ hasText: 'Notifications' }).first().click();
    await expect(page).toHaveURL(/\/notifications$/);
  });

  test('active nav item is highlighted on Master Data page', async ({ page }) => {
    await page.goto('/master-data');
    await expect(page.locator('[role="button"]').filter({ hasText: 'Master Data' }).first()).toHaveCSS('color', 'rgb(128, 51, 128)');
  });
});
