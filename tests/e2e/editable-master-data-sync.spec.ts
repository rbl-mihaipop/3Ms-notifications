import { test, expect } from '@playwright/test';

test.describe('Editable master data + synchronized notifications', () => {
  test('editing managers creates assignment notifications and toast sync', async ({ page }) => {
    await page.goto('/master-data');

    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByLabel('Portfolio Manager').click();
    await page.getByRole('option', { name: 'Mihaela Popescu' }).click();
    await page.getByLabel('Object Manager').click();
    await page.getByRole('option', { name: 'Elena Dumitrescu' }).click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Object assignment updated')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Mihaela Popescu' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Elena Dumitrescu' }).first()).toBeVisible();

    await page.locator('[role="button"]').filter({ hasText: 'Notifications' }).first().click();
    await page.getByRole('tab', { name: /assignments/i }).click();
    await expect(page.getByRole('tab', { name: /assignments/i })).toContainText('6');
    await expect(page.getByText('Object assignment updated').first()).toBeVisible();
    await expect(page.getByTestId('notification-cta').first()).toContainText(/view object/i);

    await page.getByRole('tab', { name: /all/i }).click();
    await expect(page.getByText('Object assignment updated').first()).toBeVisible();
  });

  test('report download flow emits started, in-progress, and done updates', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('tab', { name: /reports/i }).click();

    await page.getByTestId('notification-cta').first().click();
    await page.getByRole('dialog').getByRole('button', { name: /download pdf/i }).click();

    await expect(page.getByText('Report generation started').first()).toBeVisible();
    await expect(page.getByText('Report generation in progress').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Report ready').first()).toBeVisible({ timeout: 7000 });
    await expect(page.getByTestId('notification-cta').first()).toContainText(/download report/i);
  });
});
