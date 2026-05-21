import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: { default: '#F5F5F5' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: 'none', border: '1px solid #E5E7EB', borderRadius: 8 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#fff',
          color: '#111',
        },
      },
    },
  },
});

export const CATEGORY_COLORS = {
  action_required: '#C0392B',
  new_reports: '#0F6E56',
  fyi: '#0C447C',
} as const;

export const CATEGORY_LABELS = {
  action_required: 'Action Required',
  new_reports: 'New Reports',
  fyi: 'Updates',
} as const;

export const SUBTYPE_LABELS = {
  past_closing_date: 'PAST CLOSING DATE',
  phase_transition: 'PHASE TRANSITION',
  parameter_change: 'PARAMETER CHANGE',
  report_generation: 'REPORT STATUS',
  report_ready: 'REPORT READY',
  object_assigned: 'NEWLY ASSIGNED',
} as const;

export const STATUS_BADGE_COLORS = {
  new: { bg: '#F3F4F6', color: '#374151' },
  in_progress: { bg: '#FEF3C7', color: '#92400E' },
  resolved: { bg: '#D1FAE5', color: '#065F46' },
} as const;

export const STATUS_BADGE_LABELS = {
  new: 'new',
  in_progress: 'in progress',
  resolved: 'resolved',
} as const;
