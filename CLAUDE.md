# CLAUDE.md — STRATUS: Actionable Notifications & Task Alerts

## Project Overview

STRATUS is a frontend-only hackathon demo for a Building Portfolio Management platform.
The core deliverable is a polished **Notification Center** that aggregates and displays
actionable alerts for real-estate portfolio events.

Demo deadline: **16:00 today**.

---

## Team & Ownership

| Person | Role | Owns |
|--------|------|------|
| Designer | UI/UX, visual decisions, presentation | Theme, layout polish, design review |
| Mirel | QA, testing, bug validation | Tests, smoke checks, issue reporting |
| Mihai | Developer, architecture, implementation | All code files |

---

## Architecture Decisions

- **React + TypeScript** via Vite
- **MUI v5** for all UI components — use `sx` and `styled()` for overrides
- **Redux Toolkit** for global state (notifications slice only)
- **React Router v6** for routing
- **Mock data only** — no backend, no API calls, no auth
- The existing `src/shared/mocks/` and `src/shared/types/` are the source of truth

---

## Folder Structure

```
src/
├── app/              # store.ts, routes.tsx
├── pages/            # NotificationsPage, PlaceholderPage
├── components/
│   └── notifications/  # NotificationCard, ReportDetailModal, etc.
├── state/
│   └── slices/         # notificationsSlice.ts
├── shared/             # DO NOT MOVE — existing mock data lives here
│   ├── mocks/          # buildings.json, reports.json, notifications.json, users.json
│   └── types/          # mockDataTypes.ts
├── layouts/            # MainLayout.tsx
└── theme/              # theme.ts
```

---

## Notification Category Model

Three categories drive the entire UI — this is the core design decision:

| Category | Color | Intent | Examples |
|----------|-------|--------|---------|
| `action_required` | Red `#C0392B` | User must respond | Past closing date, phase transition |
| `new_reports` | Teal `#0F6E56` | Something ready to view | Generated reports |
| `fyi` | Blue `#0C447C` | Stay informed, no action needed | New object assignments |

Each notification also has a `subtype` for the card label (e.g. PAST CLOSING DATE, REPORT READY).

---

## Demo Scope & Priority

| Priority | Feature | Status |
|----------|---------|--------|
| 1 — CORE | New Reports notifications + View Report modal | Must be polished |
| 2 — If time allows | Newly assigned objects (FYI tab) | Only after P1 signed off |
| 3 — Stretch | Projects past closing date (Action Required tab) | Stretch goal |

**Never suggest P2/P3 work while P1 is not demo-ready.**

---

## Coding Conventions

- No `any` types — use the types from `src/shared/types/mockDataTypes.ts`
- Components: PascalCase files, named exports
- Hooks: `useAppDispatch`, `useAppSelector` from `src/app/hooks.ts`
- Import alias: `@shared/` maps to `src/shared/`
- No default prop values on required props — let TypeScript catch it
- No comments unless the WHY is non-obvious

---

## What NOT to Do

- Do NOT add Tailwind, Zustand, React Query, or any unlisted library
- Do NOT add a backend, authentication, or real API calls
- Do NOT add websockets or real-time simulation
- Do NOT touch `src/shared/mocks/` schema without updating `src/shared/types/mockDataTypes.ts`
- Do NOT start P2 or P3 features before P1 is signed off by the designer
- Do NOT over-engineer: no factory patterns, no service layers, no DI containers
- Do NOT add unit tests during the core build phase — test after P1 is demo-ready

---

## Mock Data Strategy

- `mockNotifications` is seeded into Redux store on app init
- Never fetch from an API — import directly from `@shared/mocks`
- Romanian building names and realistic data are intentional — keep them
- If you need more notifications, add entries to `notifications.json` directly

---

## UI/UX Expectations

- Match the design screenshot closely: clean white cards, colored left border, status badges
- AppBar: white background, 1px bottom border, no box shadow
- Cards: 1px border, 8px radius, no elevation shadows
- Buttons: no uppercase transform, medium weight
- Typography: Inter or system-font stack

---

## Git Workflow

- Branch from `main`, small focused commits
- Commit format: `feat(notifications): short description`
- Push frequently — 3 people are working simultaneously
- Keep commits isolated to one component or feature

---

## Demo Success Criteria

1. App loads and shows the Notifications page with the bell badge
2. "New Reports" tab shows report-ready notifications
3. "View report" CTA opens a polished modal with report details
4. Mark as read works, badge count updates
5. "Mark all as read" clears the badge
6. No console errors during the demo path
7. UI looks polished and presentation-ready
