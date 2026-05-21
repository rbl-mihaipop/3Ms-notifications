# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: notification-actions-menu.spec.ts >> Notification card action menu (kebab dropdown) >> New Reports dropdown exposes Download / Mark as read / Dismiss notification in order
- Location: tests/e2e/notification-actions-menu.spec.ts:33:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: /new reports/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - paragraph [ref=e7]: s
      - paragraph [ref=e8]: stratus
    - separator [ref=e9]
    - generic [ref=e10]:
      - list [ref=e11]:
        - listitem [ref=e12]:
          - button "Master Data" [ref=e13] [cursor=pointer]:
            - img [ref=e15]
            - generic [ref=e18]: Master Data
      - list [ref=e19]:
        - listitem [ref=e20]:
          - button "Notifications 10" [ref=e21] [cursor=pointer]:
            - img [ref=e23]
            - generic [ref=e26]: Notifications
            - generic [ref=e27]: "10"
  - generic [ref=e28]:
    - generic [ref=e29]:
      - generic [ref=e31]: DEV
      - button [ref=e32] [cursor=pointer]:
        - img [ref=e33]
      - generic [ref=e35]: SK
    - main [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - tablist [ref=e41]:
            - tab "Action required 3" [selected] [ref=e42] [cursor=pointer]:
              - generic [ref=e43]:
                - generic [ref=e44]: Action required
                - generic [ref=e45]: "3"
            - tab "Updates 4" [ref=e46] [cursor=pointer]:
              - generic [ref=e47]:
                - generic [ref=e48]: Updates
                - generic [ref=e49]: "4"
          - button "New Reports 3" [ref=e51] [cursor=pointer]:
            - img [ref=e53]
            - text: New Reports
            - generic [ref=e56]: "3"
        - generic [ref=e57]:
          - generic [ref=e58]:
            - generic [ref=e60]:
              - generic [ref=e61]:
                - img [ref=e62]
                - generic [ref=e64]:
                  - paragraph [ref=e65]: Notifications
                  - text: Items where you need to take action in the project itself
              - generic [ref=e66]:
                - button [ref=e67] [cursor=pointer]:
                  - img [ref=e68]
                - button "Mark all as read" [ref=e70] [cursor=pointer]
                - button [ref=e71] [cursor=pointer]:
                  - img [ref=e72]
            - alert [ref=e74]:
              - generic [ref=e75]: These items clear automatically once you fix the underlying issue in the project.
            - generic [ref=e76]:
              - paragraph [ref=e78]: Pinned
              - generic [ref=e79] [cursor=pointer]:
                - generic [ref=e82]: Past closing date
                - generic [ref=e83]:
                  - generic [ref=e84]:
                    - paragraph [ref=e85]: Bucharest Office Tower – Phase II acquisition
                    - generic [ref=e87]: new
                  - paragraph [ref=e88]: Refurbishment project expected to close but remains open.
                  - paragraph [ref=e89]:
                    - text: Expected close 14/05/2026 ·
                    - generic [ref=e90]: 7 days overdue
                  - paragraph [ref=e91]: Clears when closing date is updated in the project
                - button "Go to project →" [ref=e92]
                - button [ref=e93]:
                  - img [ref=e94]
              - generic [ref=e96]:
                - paragraph [ref=e98]: TODAY · 21 MAY 2026
                - generic [ref=e99] [cursor=pointer]:
                  - generic [ref=e102]: Past closing date
                  - generic [ref=e103]:
                    - generic [ref=e104]:
                      - paragraph [ref=e105]: Northgate Logistics – Disposal of Asset 4B
                      - generic [ref=e107]: new
                    - paragraph [ref=e108]: Project exceeded expected closing date. Budget overrun of 12% recorded.
                    - paragraph [ref=e109]:
                      - text: Expected close 09/05/2026 ·
                      - generic [ref=e110]: 12 days overdue
                    - paragraph [ref=e111]: Clears when closing date is updated in the project
                  - button "Go to project →" [ref=e112]
                  - button [ref=e113]:
                    - img [ref=e114]
              - generic [ref=e116]:
                - paragraph [ref=e118]: YESTERDAY · 20 MAY 2026
                - generic [ref=e119] [cursor=pointer]:
                  - generic [ref=e122]: Past closing date
                  - generic [ref=e123]:
                    - generic [ref=e124]:
                      - paragraph [ref=e125]: Brașov Green Offices – Refurbishment Phase 3
                      - generic [ref=e127]: new
                    - paragraph [ref=e128]: Refurbishment phase 3 passed its expected completion date.
                    - paragraph [ref=e129]:
                      - text: Expected close 05/05/2026 ·
                      - generic [ref=e130]: 16 days overdue
                    - paragraph [ref=e131]: Clears when closing date is updated in the project
                  - button "Go to project →" [ref=e132]
                  - button [ref=e133]:
                    - img [ref=e134]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - button [ref=e139] [cursor=pointer]:
                - img [ref=e140]
              - paragraph [ref=e142]: May 2026
              - button [ref=e143] [cursor=pointer]:
                - img [ref=e144]
            - button "Today" [ref=e147] [cursor=pointer]
            - generic [ref=e148]:
              - paragraph [ref=e149]: Mon
              - paragraph [ref=e150]: Tue
              - paragraph [ref=e151]: Wed
              - paragraph [ref=e152]: Thu
              - paragraph [ref=e153]: Fri
              - paragraph [ref=e154]: Sat
              - paragraph [ref=e155]: Sun
            - generic [ref=e156]:
              - paragraph [ref=e162]: "1"
              - paragraph [ref=e164]: "2"
              - paragraph [ref=e166]: "3"
              - paragraph [ref=e168]: "4"
              - paragraph [ref=e170]: "5"
              - paragraph [ref=e172]: "6"
              - paragraph [ref=e174]: "7"
              - paragraph [ref=e176]: "8"
              - paragraph [ref=e178]: "9"
              - paragraph [ref=e180]: "10"
              - paragraph [ref=e182]: "11"
              - paragraph [ref=e184]: "12"
              - paragraph [ref=e186]: "13"
              - paragraph [ref=e188]: "14"
              - paragraph [ref=e190]: "15"
              - paragraph [ref=e192]: "16"
              - paragraph [ref=e194]: "17"
              - paragraph [ref=e196]: "18"
              - paragraph [ref=e198]: "19"
              - generic [ref=e199] [cursor=pointer]:
                - paragraph [ref=e200]: "20"
                - paragraph [ref=e201]: "4"
              - generic [ref=e202] [cursor=pointer]:
                - paragraph [ref=e203]: "21"
                - paragraph [ref=e204]: "6"
              - paragraph [ref=e206]: "22"
              - paragraph [ref=e208]: "23"
              - paragraph [ref=e210]: "24"
              - paragraph [ref=e212]: "25"
              - paragraph [ref=e214]: "26"
              - paragraph [ref=e216]: "27"
              - paragraph [ref=e218]: "28"
              - paragraph [ref=e220]: "29"
              - paragraph [ref=e222]: "30"
              - paragraph [ref=e224]: "31"
            - paragraph [ref=e234]: Days with notifications
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Action Required dropdown items, in render order (matches NotificationCard.tsx)
  4   | const ACTION_REQUIRED_MENU_ITEMS = [
  5   |   'Snooze for 3 days',
  6   |   'Snooze until closing date',
  7   |   'Unpin', // First Action Required card (ntf-007) is pinned in the mock data
  8   |   'Mark as read',
  9   |   'Report as incorrect',
  10  | ];
  11  | 
  12  | const NEW_REPORTS_MENU_ITEMS = ['Download', 'Mark as read', 'Dismiss notification'];
  13  | const UPDATES_MENU_ITEMS = ['Mark as read', 'Dismiss notification'];
  14  | 
  15  | test.describe('Notification card action menu (kebab dropdown)', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await page.goto('/notifications');
  18  |   });
  19  | 
  20  |   test('Action Required dropdown exposes 5 actions in order, with Unpin for the pinned card', async ({ page }) => {
  21  |     await page.getByRole('tab', { name: /action required/i }).click();
  22  |     const firstCard = page.getByTestId('notification-card').first();
  23  |     await firstCard.getByTestId('notification-kebab').click();
  24  | 
  25  |     const items = page.getByRole('menuitem');
  26  |     await expect(items).toHaveCount(ACTION_REQUIRED_MENU_ITEMS.length);
  27  |     for (let i = 0; i < ACTION_REQUIRED_MENU_ITEMS.length; i++) {
  28  |       // Index i corresponds to the i-th item in ACTION_REQUIRED_MENU_ITEMS
  29  |       await expect(items.nth(i)).toHaveText(ACTION_REQUIRED_MENU_ITEMS[i]);
  30  |     }
  31  |   });
  32  | 
  33  |   test('New Reports dropdown exposes Download / Mark as read / Dismiss notification in order', async ({ page }) => {
> 34  |     await page.getByRole('tab', { name: /new reports/i }).click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  35  |     const firstCard = page.getByTestId('notification-card').first();
  36  |     await firstCard.getByTestId('notification-kebab').click();
  37  | 
  38  |     const items = page.getByRole('menuitem');
  39  |     await expect(items).toHaveCount(NEW_REPORTS_MENU_ITEMS.length);
  40  |     for (let i = 0; i < NEW_REPORTS_MENU_ITEMS.length; i++) {
  41  |       // Index i corresponds to the i-th item in NEW_REPORTS_MENU_ITEMS
  42  |       await expect(items.nth(i)).toHaveText(NEW_REPORTS_MENU_ITEMS[i]);
  43  |     }
  44  |   });
  45  | 
  46  |   test('Updates dropdown shows only Mark as read and Dismiss (no Download, no Snooze)', async ({ page }) => {
  47  |     await page.getByRole('tab', { name: /updates/i }).click();
  48  |     const firstCard = page.getByTestId('notification-card').first();
  49  |     await firstCard.getByTestId('notification-kebab').click();
  50  | 
  51  |     const items = page.getByRole('menuitem');
  52  |     await expect(items).toHaveCount(UPDATES_MENU_ITEMS.length);
  53  |     for (let i = 0; i < UPDATES_MENU_ITEMS.length; i++) {
  54  |       // Index i corresponds to the i-th item in UPDATES_MENU_ITEMS
  55  |       await expect(items.nth(i)).toHaveText(UPDATES_MENU_ITEMS[i]);
  56  |     }
  57  |     await expect(page.getByRole('menuitem', { name: 'Download', exact: true })).toHaveCount(0);
  58  |     await expect(page.getByRole('menuitem', { name: /snooze/i })).toHaveCount(0);
  59  |   });
  60  | 
  61  |   test('Dismiss removes the specific Willow Creek card from the Updates list', async ({ page }) => {
  62  |     await page.getByRole('tab', { name: /updates/i }).click();
  63  |     // ntf-005 (Willow Creek) is the first card in the Updates tab per the mock data
  64  |     const willowCreekTitle = /willow creek apartments has been assigned/i;
  65  |     await expect(page.getByText(willowCreekTitle)).toBeVisible();
  66  |     await expect(page.getByTestId('notification-card')).toHaveCount(4);
  67  | 
  68  |     const firstCard = page.getByTestId('notification-card').first();
  69  |     await firstCard.getByTestId('notification-kebab').click();
  70  |     await page.getByRole('menuitem', { name: 'Dismiss notification', exact: true }).click();
  71  | 
  72  |     // Exactly one card dismissed, and it's Willow Creek
  73  |     await expect(page.getByTestId('notification-card')).toHaveCount(3);
  74  |     await expect(page.getByText(willowCreekTitle)).toHaveCount(0);
  75  |   });
  76  | 
  77  |   test('Mark as read from dropdown flips the unread dot indicator to read', async ({ page }) => {
  78  |     await page.getByRole('tab', { name: /updates/i }).click();
  79  |     const firstCard = page.getByTestId('notification-card').first();
  80  |     const unreadDot = firstCard.getByTestId('notification-unread-dot');
  81  | 
  82  |     await expect(unreadDot).toHaveAttribute('data-unread', 'true');
  83  | 
  84  |     await firstCard.getByTestId('notification-kebab').click();
  85  |     await page.getByRole('menuitem', { name: 'Mark as read', exact: true }).click();
  86  | 
  87  |     await expect(unreadDot).toHaveAttribute('data-unread', 'false');
  88  |   });
  89  | 
  90  |   test('Pin toggle on Action Required: Unpin removes the PINNED section header', async ({ page }) => {
  91  |     await page.getByRole('tab', { name: /action required/i }).click();
  92  | 
  93  |     // The pinned card (ntf-007 Bucharest Office Tower) sits under the "Pinned" group header
  94  |     await expect(page.getByText('Pinned', { exact: true })).toBeVisible();
  95  | 
  96  |     // The pinned card is rendered first because pinned items render before date groups
  97  |     const pinnedCard = page.getByTestId('notification-card').first();
  98  |     await pinnedCard.getByTestId('notification-kebab').click();
  99  | 
  100 |     const pinToggle = page.getByRole('menuitem', { name: 'Unpin', exact: true });
  101 |     await expect(pinToggle).toBeVisible();
  102 |     await pinToggle.click();
  103 | 
  104 |     // After unpinning the only pinned card, the Pinned section header must disappear
  105 |     await expect(page.getByText('Pinned', { exact: true })).toHaveCount(0);
  106 |   });
  107 | 
  108 |   test('Pin label switches between Pin and Unpin based on pinned state', async ({ page }) => {
  109 |     await page.getByRole('tab', { name: /action required/i }).click();
  110 |     const firstCard = page.getByTestId('notification-card').first();
  111 | 
  112 |     // ntf-007 is pinned → menu shows "Unpin"
  113 |     await firstCard.getByTestId('notification-kebab').click();
  114 |     await expect(page.getByRole('menuitem', { name: 'Unpin', exact: true })).toBeVisible();
  115 |     await page.getByRole('menuitem', { name: 'Unpin', exact: true }).click();
  116 | 
  117 |     // Reopen the menu on the now-unpinned card (which is the same first card after re-sort)
  118 |     // After unpinning, the first card in render order will be a date-grouped one. Find the
  119 |     // formerly-pinned Bucharest Office Tower card by title.
  120 |     const bucharestCard = page
  121 |       .getByTestId('notification-card')
  122 |       .filter({ hasText: 'Bucharest Office Tower – Phase II acquisition' });
  123 |     await bucharestCard.getByTestId('notification-kebab').click();
  124 | 
  125 |     await expect(page.getByRole('menuitem', { name: 'Pin', exact: true })).toBeVisible();
  126 |     await expect(page.getByRole('menuitem', { name: 'Unpin', exact: true })).toHaveCount(0);
  127 |   });
  128 | 
  129 |   test('Escape closes the action menu', async ({ page }) => {
  130 |     await page.getByRole('tab', { name: /updates/i }).click();
  131 |     const firstCard = page.getByTestId('notification-card').first();
  132 |     await firstCard.getByTestId('notification-kebab').click();
  133 | 
  134 |     await expect(page.getByRole('menuitem', { name: 'Mark as read', exact: true })).toBeVisible();
```