# CODEX.md — STRATUS Implementation Conventions

## Architecture Overview

Single-page React + TypeScript app. One Redux slice (`notifications`). One real page (`/notifications`). All other routes show a placeholder. No backend.

```
main.tsx → Provider + BrowserRouter + ThemeProvider
  └── MainLayout (AppBar + Outlet)
        ├── /notifications → NotificationsPage
        └── /portfolio|assets|deals|reports → PlaceholderPage
```

---

## Folder Ownership

| Folder | Owner | Contents |
|--------|-------|---------|
| `src/shared/` | All (read-only) | Mock data JSON + TypeScript types |
| `src/state/slices/` | Mihai | Redux slices |
| `src/components/notifications/` | Mihai | All notification components |
| `src/pages/` | Mihai | Page-level components |
| `src/layouts/` | Mihai | MainLayout |
| `src/theme/` | Designer review | MUI theme config |

---

## Component Patterns

```tsx
// Named export, no default export
export const NotificationCard = ({ notification }: Props) => { ... };

// Props interface in same file
interface Props {
  notification: Notification;
}

// Use sx for one-off styles, styled() for reused styles
<Box sx={{ borderLeft: `4px solid ${categoryColor}` }}>
```

---

## Redux Usage

```ts
// Reading state
const items = useAppSelector(selectFilteredNotifications);
const count = useAppSelector(selectUnreadCount);

// Dispatching
const dispatch = useAppDispatch();
dispatch(markAsRead(notification.id));
dispatch(setTab('new_reports'));
```

Never put derived data in the Redux store. Compute it in selectors.

---

## Notification Categories → UI Mapping

| `category` value | Tab label | Left border | Subtype label color |
|-----------------|-----------|-------------|-------------------|
| `action_required` | Action Required | `#C0392B` | `#C0392B` |
| `new_reports` | New Reports | `#0F6E56` | `#0F6E56` |
| `fyi` | FYI | `#0C447C` | `#0C447C` |

Status badge colors:
- `new` → gray chip
- `in_progress` → amber chip
- `resolved` → green chip

---

## Mock Data Usage

```ts
// Always import from the index
import { mockNotifications, mockReports, mockUsers } from '@shared/mocks';

// Seed Redux on store init
initialState: { items: mockNotifications, activeTab: 'all' }

// Look up related entity
const report = mockReports.find(r => r.id === notification.relatedEntityId);
const user = mockUsers.find(u => u.id === report?.generatedBy);
```

---

## Implementation Order

1. Bootstrap (Vite + deps + tsconfig alias)
2. Theme + MainLayout
3. Redux store + notificationsSlice
4. NotificationsPage shell (tabs + empty state)
5. NotificationCard — **new_reports first**
6. ReportDetailModal
7. Wire mark-as-read + mark-all-as-read
8. Polish pass (spacing, badge colors, typography)
9. PlaceholderPage for other routes

---

## Anti-Patterns to Avoid

- No `any` — use the types from `src/shared/types/mockDataTypes.ts`
- No direct DOM manipulation
- No `useEffect` for Redux state — use selectors
- No prop drilling past 2 levels — use Redux
- No inline style objects on repeated components — use `sx` or `styled()`
- No extra npm packages without flagging to the team first
- No default exports from component files
