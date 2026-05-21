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
  activeTab: NotificationCategory | 'all';
  toasts: ToastMessage[];
}

const initialState: NotificationsState = {
  items: mockNotifications as Notification[],
  activeTab: 'all',
  toasts: [],
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
      state.items.forEach((n) => { n.status = 'read'; });
    },
    setTab(state, action: PayloadAction<NotificationCategory | 'all'>) {
      state.activeTab = action.payload;
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
  setTab,
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

export const selectUnreadCount = createSelector(
  selectAllNotifications,
  (items) => items.filter((n) => n.status === 'unread').length,
);

export const selectTabCounts = createSelector(
  selectAllNotifications,
  (items) => ({
    all: items.length,
    action_required: items.filter((n) => n.category === 'action_required').length,
    new_reports: items.filter((n) => n.category === 'new_reports').length,
    fyi: items.filter((n) => n.category === 'fyi').length,
  }),
);

export const selectItemsByTab = createSelector(
  selectAllNotifications,
  selectActiveTab,
  (items, tab) =>
    tab === 'all' ? items : items.filter((n) => n.category === tab),
);
