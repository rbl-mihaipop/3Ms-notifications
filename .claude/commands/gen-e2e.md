# gen-e2e — Generate or update Playwright E2E tests

Generate or update Playwright E2E tests for this project following these strict rules.

## Before writing any test

1. Read the component or page under test to extract the **exact rendered strings** — labels, button text, chip text, section headers, error messages, snackbar text.
2. Read the mock data files (`src/shared/mocks/*.json`) to get real entity names, IDs, counts, and field values.
3. Read `src/theme/theme.ts` for `SUBTYPE_LABELS` — never guess label text.
4. Check existing spec files in `tests/e2e/` before touching them.

## Assertion rules — REQUIRED

Every assertion must validate a **specific value**, not just presence:

| Instead of | Use |
|-----------|-----|
| `expect(el).toBeVisible()` | `expect(el).toHaveText('exact text')` |
| `expect(el).toBeVisible()` | `expect(el).toContainText('partial text')` |
| `expect(locator).toHaveCount(n)` alone | Also assert content of first/last item |
| `expect(badge).toBeVisible()` | `expect(badge).toHaveText('10')` |

Acceptable uses of `toBeVisible()` alone:
- Asserting a dialog/modal opened (no better selector exists)
- Asserting an element that was previously hidden is now shown (state transition)
- After a `not.toBeVisible()` check that establishes the hidden baseline

Never write a test whose only assertion is `toBeVisible()`.

## Strict mode — avoid multi-match errors

- Use `{ exact: true }` when the text appears as a substring of another element's text.
- Use `.first()` or `.last()` only when the multiplicity is intentional and documented with a comment.
- Never use `.nth(n)` without a comment explaining which item it refers to.

## Preserving existing assertions

**NEVER delete or weaken an existing assertion** unless:
- The component code it tests has changed (confirm by reading the source file first)
- The mock data it targets has changed

If an existing test fails after a code change, fix the assertion to match the new behavior — do not remove it.
When adding new tests to an existing spec file, append only — do not modify passing tests.

## Test structure

```typescript
test('describes the specific behaviour and expected value', async ({ page }) => {
  // Arrange: navigate and set up state
  await page.goto('/notifications');
  await page.getByRole('tab', { name: /new reports/i }).click();

  // Act: trigger the behaviour
  await page.getByTestId('notification-cta').first().click();

  // Assert: validate specific values
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible(); // OK — state transition
  await expect(dialog.getByText('Q1 2025 Portfolio Performance Report')).toBeVisible();
  await expect(dialog.getByText('PDF').first()).toBeVisible();
  await expect(dialog.getByText('Alexandru Ionescu')).toBeVisible();
});
```

## Naming

- Test name must describe the **outcome**, not the action: `'sidebar badge shows 10 when all notifications are unread'` not `'badge works'`.
- `describe` block = feature area (e.g. `'New Reports — View Report modal'`).

## File placement

- One spec file per feature area: `tests/e2e/<feature>.spec.ts`
- Add to an existing file if the feature is already covered there.
- Never mix unrelated features in one spec file.

## What to do with $ARGUMENTS

If arguments are provided, treat them as the feature or file to target.
If no arguments are provided, ask the user which feature to generate tests for.
