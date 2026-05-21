import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationCategory } from '@shared/types/mockDataTypes';
import mockNotifications from '@shared/mocks/notifications.json';
import type { RootState } from '../../app/store';

interface NotificationsState {
  items: Notification[];
  activeTab: NotificationCategory | 'all';
}

const initialState: NotificationsState = {
  items: mockNotifications.map((n) => ({ ...n })) as Notification[],
  activeTab: 'action_required',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
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
    setTab(state, action: PayloadAction<NotificationCategory | 'all'>) {
      state.activeTab = action.payload;
    },
  },
});

export const { markAsRead, markAllAsRead, setTab, dismiss, togglePin } = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Selectors
export const selectAllNotifications = (state: RootState) =>
  state.notifications.items;

export const selectActiveTab = (state: RootState) =>
  state.notifications.activeTab;

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

export const selectItemsByTab = createSelector(
  selectAllNotifications,
  selectActiveTab,
  (items, tab) =>
    tab === 'all' ? items : items.filter((n) => n.category === tab),
);
