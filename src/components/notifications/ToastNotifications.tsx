import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { dismissToast, selectToasts } from '../../state/slices/notificationsSlice';

export const ToastNotifications = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  const activeToast = toasts[0];

  if (!activeToast) return null;

  return (
    <Snackbar
      key={activeToast.id}
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={4000}
      onClose={() => dispatch(dismissToast(activeToast.id))}
    >
      <Alert
        severity={activeToast.severity}
        variant="filled"
        onClose={() => dispatch(dismissToast(activeToast.id))}
        sx={{ minWidth: 320 }}
      >
        <strong>{activeToast.title}</strong> — {activeToast.message}
      </Alert>
    </Snackbar>
  );
};
