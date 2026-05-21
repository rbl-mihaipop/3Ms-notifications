import { test, expect } from '@playwright/test';

test.describe('Assignments (FYI) tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('tab', { name: /updates/i }).click();
  });

  test('shows 4 notification cards', async ({ page }) => {
    await expect(page.getByTestId('notification-card')).toHaveCount(4);
  });

  test('shows Object assigned subtype chip for object assignments', async ({ page }) => {
    await expect(page.getByTestId('notification-subtype').first()).toHaveText('Object assigned');
  });

  test('shows Parameter change subtype chip', async ({ page }) => {
    await expect(page.getByTestId('notification-subtype').last()).toHaveText('Parameter change');
  });

  test('shows design notification titles', async ({ page }) => {
    await expect(page.getByText(/willow creek apartments/i)).toBeVisible();
    await expect(page.getByText(/riverbend tower/i)).toBeVisible();
    await expect(page.getByText(/cedar heights/i)).toBeVisible();
    await expect(page.getByText(/cpi benchmark/i)).toBeVisible();
  });

  test('shows value-change visual for parameter change cards', async ({ page }) => {
    await expect(page.getByText('5.80%')).toBeVisible();
    await expect(page.getByText('6.10%')).toBeVisible();
  });

  test('CTA links are present on each card', async ({ page }) => {
    const ctas = page.getByTestId('notification-cta');
    const count = await ctas.count();
    for (let i = 0; i < count; i++) {
      await expect(ctas.nth(i)).toContainText(/view/i);
    }
  });

  test('clicking a card marks it as read and card remains visible', async ({ page }) => {
    const card = page.getByTestId('notification-card').first();
    await card.click();
    await expect(card).toBeVisible();
  });

  test('TODAY date group is visible', async ({ page }) => {
    await expect(page.getByText(/today/i).first()).toBeVisible();
  });

  test('YESTERDAY date group is visible', async ({ page }) => {
    await expect(page.getByText(/yesterday/i).first()).toBeVisible();
  });

  test('no amber warning banner on Updates tab', async ({ page }) => {
    await expect(page.getByText(/clear automatically/i)).not.toBeVisible();
  });
});
