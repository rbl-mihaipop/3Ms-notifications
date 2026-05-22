import { test, expect } from '@playwright/test';

// Action Required dropdown items, in render order (matches NotificationCard.tsx)
const ACTION_REQUIRED_MENU_ITEMS = [
  'Snooze for 3 days',
  'Snooze until closing date',
  'Unpin', // First Action Required card (ntf-007) is pinned in the mock data
  'Mark as read',
  'Report as incorrect',
];

const NEW_REPORTS_MENU_ITEMS = ['Download', 'Mark as read', 'Dismiss notification'];
const UPDATES_MENU_ITEMS = ['Mark as read', 'Dismiss notification'];

test.describe('Notification card action menu (kebab dropdown)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
  });

  test('Action Required dropdown exposes 5 actions in order, with Unpin for the pinned card', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    const firstCard = page.getByTestId('notification-card').first();
    await firstCard.getByTestId('notification-kebab').click();

    const items = page.getByRole('menuitem');
    await expect(items).toHaveCount(ACTION_REQUIRED_MENU_ITEMS.length);
    for (let i = 0; i < ACTION_REQUIRED_MENU_ITEMS.length; i++) {
      // Index i corresponds to the i-th item in ACTION_REQUIRED_MENU_ITEMS
      await expect(items.nth(i)).toHaveText(ACTION_REQUIRED_MENU_ITEMS[i]);
    }
  });

  test('New Reports dropdown exposes Download / Mark as read / Dismiss notification in order', async ({ page }) => {
    // New Reports moved from a tab to a right-side drawer (PR #9)
    await page.getByTestId('new-reports-button').click();
    const drawer = page.getByTestId('new-reports-drawer');
    const firstCard = drawer.getByTestId('notification-card').first();
    await firstCard.getByTestId('notification-kebab').click();

    const items = page.getByRole('menuitem');
    await expect(items).toHaveCount(NEW_REPORTS_MENU_ITEMS.length);
    for (let i = 0; i < NEW_REPORTS_MENU_ITEMS.length; i++) {
      // Index i corresponds to the i-th item in NEW_REPORTS_MENU_ITEMS
      await expect(items.nth(i)).toHaveText(NEW_REPORTS_MENU_ITEMS[i]);
    }
  });

  test('Updates dropdown shows only Mark as read and Dismiss (no Download, no Snooze)', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    const firstCard = page.getByTestId('notification-card').first();
    await firstCard.getByTestId('notification-kebab').click();

    const items = page.getByRole('menuitem');
    await expect(items).toHaveCount(UPDATES_MENU_ITEMS.length);
    for (let i = 0; i < UPDATES_MENU_ITEMS.length; i++) {
      // Index i corresponds to the i-th item in UPDATES_MENU_ITEMS
      await expect(items.nth(i)).toHaveText(UPDATES_MENU_ITEMS[i]);
    }
    await expect(page.getByRole('menuitem', { name: 'Download', exact: true })).toHaveCount(0);
    await expect(page.getByRole('menuitem', { name: /snooze/i })).toHaveCount(0);
  });

  test('Dismiss removes the specific Willow Creek card from the Updates list', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    // ntf-005 (Willow Creek) is the first card in the Updates tab per the mock data
    const willowCreekTitle = /willow creek apartments has been assigned/i;
    await expect(page.getByText(willowCreekTitle)).toBeVisible();
    await expect(page.getByTestId('notification-card')).toHaveCount(4);

    const firstCard = page.getByTestId('notification-card').first();
    await firstCard.getByTestId('notification-kebab').click();
    await page.getByRole('menuitem', { name: 'Dismiss notification', exact: true }).click();

    // Exactly one card dismissed, and it's Willow Creek
    await expect(page.getByTestId('notification-card')).toHaveCount(3);
    await expect(page.getByText(willowCreekTitle)).toHaveCount(0);
  });

  test('Mark as read from dropdown flips the unread dot indicator to read', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    const firstCard = page.getByTestId('notification-card').first();
    const unreadDot = firstCard.getByTestId('notification-unread-dot');

    await expect(unreadDot).toHaveAttribute('data-unread', 'true');

    await firstCard.getByTestId('notification-kebab').click();
    await page.getByRole('menuitem', { name: 'Mark as read', exact: true }).click();

    await expect(unreadDot).toHaveAttribute('data-unread', 'false');
  });

  test('Pin toggle on Action Required: Unpin removes the PINNED section header', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();

    // The pinned card (ntf-007 Bucharest Office Tower) sits under the "Pinned" group header
    await expect(page.getByText('Pinned', { exact: true })).toBeVisible();

    // The pinned card is rendered first because pinned items render before date groups
    const pinnedCard = page.getByTestId('notification-card').first();
    await pinnedCard.getByTestId('notification-kebab').click();

    const pinToggle = page.getByRole('menuitem', { name: 'Unpin', exact: true });
    await expect(pinToggle).toBeVisible();
    await pinToggle.click();

    // After unpinning the only pinned card, the Pinned section header must disappear
    await expect(page.getByText('Pinned', { exact: true })).toHaveCount(0);
  });

  test('Pin label switches between Pin and Unpin based on pinned state', async ({ page }) => {
    await page.getByRole('tab', { name: /action required/i }).click();
    const firstCard = page.getByTestId('notification-card').first();

    // ntf-007 is pinned → menu shows "Unpin"
    await firstCard.getByTestId('notification-kebab').click();
    await expect(page.getByRole('menuitem', { name: 'Unpin', exact: true })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Unpin', exact: true }).click();

    // Reopen the menu on the now-unpinned card (which is the same first card after re-sort)
    // After unpinning, the first card in render order will be a date-grouped one. Find the
    // formerly-pinned Bucharest Office Tower card by title.
    const bucharestCard = page
      .getByTestId('notification-card')
      .filter({ hasText: 'Bucharest Office Tower – Phase II acquisition' });
    await bucharestCard.getByTestId('notification-kebab').click();

    await expect(page.getByRole('menuitem', { name: 'Pin', exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Unpin', exact: true })).toHaveCount(0);
  });

  test('Escape closes the action menu', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    const firstCard = page.getByTestId('notification-card').first();
    await firstCard.getByTestId('notification-kebab').click();

    await expect(page.getByRole('menuitem', { name: 'Mark as read', exact: true })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menuitem', { name: 'Mark as read', exact: true })).toHaveCount(0);
  });
});

test.describe('Mark all as read', () => {
  test('clears the unread badge in the sidebar', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByTestId('notification-badge')).toHaveText('10');

    await page.getByRole('button', { name: /mark all as read/i }).click();

    await expect(page.getByTestId('notification-badge')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /mark all as read/i })).not.toBeVisible();
  });

  test('flips every notification card to read across both tabs and the New Reports drawer', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('button', { name: /mark all as read/i }).click();

    // After PR #9, New Reports is a drawer; only Action Required and Updates remain as tabs
    for (const tab of [/action required/i, /updates/i]) {
      await page.getByRole('tab', { name: tab }).click();
      const dots = page.getByTestId('notification-unread-dot');
      const count = await dots.count();
      expect(count).toBeGreaterThan(0); // sanity: cards exist on this tab
      for (let i = 0; i < count; i++) {
        // Every unread-dot element on this tab must report data-unread="false"
        await expect(dots.nth(i)).toHaveAttribute('data-unread', 'false');
      }
    }

    // Verify the same in the New Reports drawer
    await page.getByTestId('new-reports-button').click();
    const drawer = page.getByTestId('new-reports-drawer');
    const drawerDots = drawer.getByTestId('notification-unread-dot');
    const drawerCount = await drawerDots.count();
    expect(drawerCount).toBeGreaterThan(0);
    for (let i = 0; i < drawerCount; i++) {
      // Index i is the i-th notification card in the drawer
      await expect(drawerDots.nth(i)).toHaveAttribute('data-unread', 'false');
    }
  });
});

test.describe('View object navigation from notification to Master Data', () => {
  test('Updates → View object on Willow Creek navigates to bld-004 and highlights that row', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('tab', { name: /updates/i }).click();

    // The first Updates card is ntf-005 (Willow Creek, relatedEntityId=bld-004)
    await page.getByTestId('notification-cta').first().click();

    await expect(page).toHaveURL(/\/master-data\?object=bld-004$/);
    await expect(page.getByRole('heading', { name: 'Master Data' })).toBeVisible();
    await expect(page.getByTestId('building-row-bld-004')).toHaveAttribute('data-highlighted', 'true');
  });

  test('Action Required → Go to project on Bucharest Office Tower navigates to bld-001 and highlights that row', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('tab', { name: /action required/i }).click();

    // The first card is the pinned ntf-007 (Bucharest Office Tower, relatedEntityId=bld-001)
    await page.getByTestId('notification-cta').first().click();

    await expect(page).toHaveURL(/\/master-data\?object=bld-001$/);
    await expect(page.getByTestId('building-row-bld-001')).toHaveAttribute('data-highlighted', 'true');
    // Other rows must not be highlighted
    await expect(page.getByTestId('building-row-bld-002')).toHaveAttribute('data-highlighted', 'false');
  });
});
