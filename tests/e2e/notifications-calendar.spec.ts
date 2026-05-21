import { test, expect } from '@playwright/test';

// All notification createdAt timestamps in the mock data sit between 07:30Z and 14:35Z
// on either 2026-05-20 or 2026-05-21. Pin the timezone so date keys remain stable
// regardless of the CI host's local time.
test.use({ timezoneId: 'Europe/Bucharest' });

test.describe('Notification calendar side panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
  });

  test('calendar is visible with month label May 2026 and Today/prev/next controls', async ({ page }) => {
    const panel = page.getByTestId('calendar-side-panel');
    await expect(panel).toBeVisible();
    await expect(page.getByTestId('calendar-month-label')).toHaveText('May 2026');
    await expect(page.getByTestId('calendar-today')).toHaveText('Today');
    await expect(page.getByTestId('calendar-prev-month')).toBeVisible();
    await expect(page.getByTestId('calendar-next-month')).toBeVisible();
  });

  test('day cells show correct totals from mock data (May 20 = 4, May 21 = 6, others = 0)', async ({ page }) => {
    // Per notifications.json: 4 timestamps on 2026-05-20 and 6 on 2026-05-21
    await expect(page.getByTestId('calendar-day-2026-05-20')).toHaveAttribute('data-day-count', '4');
    await expect(page.getByTestId('calendar-day-2026-05-21')).toHaveAttribute('data-day-count', '6');
    await expect(page.getByTestId('calendar-day-2026-05-21-badge')).toHaveText('6');
    await expect(page.getByTestId('calendar-day-2026-05-20-badge')).toHaveText('4');

    // Days without notifications have count 0 and no badge
    await expect(page.getByTestId('calendar-day-2026-05-01')).toHaveAttribute('data-day-count', '0');
    await expect(page.getByTestId('calendar-day-2026-05-15')).toHaveAttribute('data-day-count', '0');
    await expect(page.getByTestId('calendar-day-2026-05-01-badge')).toHaveCount(0);
  });

  test('clicking a day filters the Updates tab to that date and shows the filter banner', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await expect(page.getByTestId('notification-card')).toHaveCount(4);

    await page.getByTestId('calendar-day-2026-05-20').click();

    // Two Updates items are dated 2026-05-20 (Cedar Heights, CPI benchmark) per mock data
    await expect(page.getByTestId('notification-card')).toHaveCount(2);
    await expect(page.getByText(/cedar heights · cap rate updated/i)).toBeVisible();
    await expect(page.getByText(/cpi benchmark updated portfolio-wide/i)).toBeVisible();

    // Filter banner appears with the human-readable date
    await expect(page.getByTestId('calendar-active-filter-banner')).toContainText('20 May 2026');
    // Selected cell marked
    await expect(page.getByTestId('calendar-day-2026-05-20')).toHaveAttribute('data-selected', 'true');
  });

  test('clicking the same day again toggles the filter off and restores the full list', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await page.getByTestId('calendar-day-2026-05-20').click();
    await expect(page.getByTestId('notification-card')).toHaveCount(2);

    await page.getByTestId('calendar-day-2026-05-20').click();

    await expect(page.getByTestId('notification-card')).toHaveCount(4);
    await expect(page.getByTestId('calendar-active-filter-banner')).toHaveCount(0);
    await expect(page.getByTestId('calendar-day-2026-05-20')).toHaveAttribute('data-selected', 'false');
  });

  test('Clear filter button in the banner clears the date filter', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await page.getByTestId('calendar-day-2026-05-20').click();
    await expect(page.getByTestId('calendar-active-filter-banner')).toBeVisible();

    await page.getByTestId('calendar-clear-filter').click();

    await expect(page.getByTestId('calendar-active-filter-banner')).toHaveCount(0);
    await expect(page.getByTestId('notification-card')).toHaveCount(4);
  });

  test('day cells with zero notifications are not selectable', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    const cardsBefore = await page.getByTestId('notification-card').count();

    await page.getByTestId('calendar-day-2026-05-15').click();

    // No filter applied, card count unchanged, no banner
    await expect(page.getByTestId('notification-card')).toHaveCount(cardsBefore);
    await expect(page.getByTestId('calendar-active-filter-banner')).toHaveCount(0);
    await expect(page.getByTestId('calendar-day-2026-05-15')).toHaveAttribute('data-selected', 'false');
  });

  test('prev/next month navigation changes the month label and clears badges (mock data is May-only)', async ({ page }) => {
    await page.getByTestId('calendar-prev-month').click();
    await expect(page.getByTestId('calendar-month-label')).toHaveText('April 2026');
    // April has no notifications in the mock
    await expect(page.getByTestId('calendar-day-2026-04-21')).toHaveAttribute('data-day-count', '0');

    await page.getByTestId('calendar-next-month').click();
    await page.getByTestId('calendar-next-month').click();
    await expect(page.getByTestId('calendar-month-label')).toHaveText('June 2026');
    await expect(page.getByTestId('calendar-day-2026-06-15')).toHaveAttribute('data-day-count', '0');
  });

  test('Today button returns the calendar to the current month', async ({ page }) => {
    await page.getByTestId('calendar-prev-month').click();
    await expect(page.getByTestId('calendar-month-label')).toHaveText('April 2026');

    await page.getByTestId('calendar-today').click();

    await expect(page.getByTestId('calendar-month-label')).toHaveText(/\w+ \d{4}/);
    // The current-month label must include the current year as rendered by the app
    const label = await page.getByTestId('calendar-month-label').textContent();
    const currentYear = new Date().getFullYear();
    expect(label).toContain(String(currentYear));
  });

  test('filter applied on Updates persists when switching tabs (filter is global)', async ({ page }) => {
    await page.getByRole('tab', { name: /updates/i }).click();
    await page.getByTestId('calendar-day-2026-05-20').click();
    await expect(page.getByTestId('notification-card')).toHaveCount(2);

    await page.getByRole('tab', { name: /new reports/i }).click();
    // New Reports has 1 item dated 2026-05-20 (Compliance Status Report)
    await expect(page.getByTestId('notification-card')).toHaveCount(1);
    await expect(page.getByText(/compliance status report/i)).toBeVisible();

    await page.getByRole('tab', { name: /action required/i }).click();
    // Action Required has 1 item dated 2026-05-20 (Brașov Green Offices)
    await expect(page.getByTestId('notification-card')).toHaveCount(1);
    await expect(page.getByText(/brașov green offices/i)).toBeVisible();
  });

  test('tab counts in the tab strip remain at their full totals regardless of date filter', async ({ page }) => {
    await page.getByTestId('calendar-day-2026-05-21').click();

    // Tab badges reflect total per category, NOT the filtered subset
    await expect(page.getByRole('tab', { name: /action required/i })).toContainText('3');
    await expect(page.getByRole('tab', { name: /new reports/i })).toContainText('3');
    await expect(page.getByRole('tab', { name: /updates/i })).toContainText('4');
  });

  test('sidebar unread badge stays at total unread (date filter does not change it)', async ({ page }) => {
    await expect(page.getByTestId('notification-badge')).toHaveText('10');
    await page.getByTestId('calendar-day-2026-05-20').click();
    await expect(page.getByTestId('notification-badge')).toHaveText('10');
  });
});
