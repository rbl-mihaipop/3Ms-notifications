import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationCategory } from '@shared/types/mockDataTypes';
import mockNotifications from '@shared/mocks/notifications.json';
import type { RootState } from '../../app/store';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning';
}

interface NotificationsState {
  items: Notification[];
  activeTab: NotificationCategory;
  toasts: ToastMessage[];
  dateFilter: string | null; // YYYY-MM-DD in local time, or null for no filter
}

const initialState: NotificationsState = {
  items: mockNotifications.map((n) => ({ ...n })) as Notification[],
  activeTab: 'action_required',
  toasts: [],
  dateFilter: null,
};

export const toLocalDateKey = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
    },
    updateNotification(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Notification> }>,
    ) {
      const item = state.items.find((n) => n.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload.changes);
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.status = 'read';
    },
    markAllAsRead(state) {
      state.items = state.items.map((n) => ({ ...n, status: 'read' as const }));
    },
    dismiss(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    togglePin(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.pinned = !item.pinned;
    },
    setTab(state, action: PayloadAction<NotificationCategory>) {
      state.activeTab = action.payload;
    },
    setDateFilter(state, action: PayloadAction<string | null>) {
      state.dateFilter = action.payload;
    },
    addToast(state, action: PayloadAction<ToastMessage>) {
      state.toasts.push(action.payload);
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const {
  addNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  dismiss,
  togglePin,
  setTab,
  setDateFilter,
  addToast,
  dismissToast,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Selectors
export const selectAllNotifications = (state: RootState) =>
  state.notifications.items;

export const selectActiveTab = (state: RootState) =>
  state.notifications.activeTab;

export const selectToasts = (state: RootState) => state.notifications.toasts;

export const selectDateFilter = (state: RootState) =>
  state.notifications.dateFilter;

export const selectUnreadCount = createSelector(
  selectAllNotifications,
  (items) => items.filter((n) => n.status === 'unread').length,
);

export const selectTabCounts = createSelector(
  selectAllNotifications,
  (items) => ({
    action_required: items.filter((n) => n.category === 'action_required').length,
    new_reports: items.filter((n) => n.category === 'new_reports').length,
    fyi: items.filter((n) => n.category === 'fyi').length,
  }),
);

// Per-day counts across all categories — keyed by 'YYYY-MM-DD' in local time
export const selectCountsByDate = createSelector(
  selectAllNotifications,
  (items): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      const key = toLocalDateKey(item.createdAt);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  },
);

export const selectItemsByTab = createSelector(
  selectAllNotifications,
  selectActiveTab,
  selectDateFilter,
  (items, tab, dateFilter) => {
    const byCategory = items.filter((n) => n.category === tab);
    if (!dateFilter) return byCategory;
    return byCategory.filter((n) => toLocalDateKey(n.createdAt) === dateFilter);
  },
);
