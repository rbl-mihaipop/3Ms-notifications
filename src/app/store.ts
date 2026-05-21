import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from '../state/slices/notificationsSlice';
import masterDataReducer from '../state/slices/masterDataSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    masterData: masterDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
