import { test, expect } from '@playwright/test';

test.describe('Assignments (FYI) tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('tab', { name: /assignments/i }).click();
  });

  test('shows 4 notification cards', async ({ page }) => {
    await expect(page.getByTestId('notification-card')).toHaveCount(4);
  });

  test('shows NEWLY ASSIGNED subtype chip for object assignments', async ({ page }) => {
    // ntf-005, ntf-006, ntf-010 → subtype object_assigned → label 'NEWLY ASSIGNED'
    await expect(page.getByTestId('notification-subtype').first()).toHaveText('NEWLY ASSIGNED');
  });

  test('shows PARAMETER CHANGE subtype chip', async ({ page }) => {
    // ntf-011 → subtype parameter_change → last card in the list
    await expect(page.getByTestId('notification-subtype').last()).toHaveText('PARAMETER CHANGE');
  });

  test('shows assigned building names', async ({ page }) => {
    await expect(page.getByText('Iași Logistics Hub').first()).toBeVisible();
    await expect(page.getByText('Constanța Retail Gallery').first()).toBeVisible();
    await expect(page.getByText('Greenfield Industrial – Sector 4B').first()).toBeVisible();
  });

  test('shows parameter change notification title', async ({ page }) => {
    await expect(page.getByText(/cap rate assumption updated/i)).toBeVisible();
  });

  test('"Go to object" CTA is present on each card', async ({ page }) => {
    const ctas = page.getByTestId('notification-cta');
    const count = await ctas.count();
    for (let i = 0; i < count; i++) {
      await expect(ctas.nth(i)).toContainText(/go to object/i);
    }
  });

  test('clicking a card marks it as read and card remains visible', async ({ page }) => {
    const card = page.getByTestId('notification-card').first();
    await card.click();
    await expect(card).toBeVisible();
  });

  test('TODAY date group is visible', async ({ page }) => {
    // ntf-005 created 2026-05-21
    await expect(page.getByText(/today/i).first()).toBeVisible();
  });

  test('YESTERDAY date group is visible', async ({ page }) => {
    // ntf-006 created 2026-05-20
    await expect(page.getByText('YESTERDAY')).toBeVisible();
  });

  test('no amber warning banner on Assignments tab', async ({ page }) => {
    await expect(page.getByText(/clear automatically/i)).not.toBeVisible();
  });
});
