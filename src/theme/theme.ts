import { createTheme } from '@mui/material';

// ── Brand tokens ──────────────────────────────────────────────────────────────
export const BRAND_PURPLE = 'rgb(128, 51, 128)';
export const BRAND_PURPLE_DARK = 'rgb(89, 35, 89)';
export const BRAND_PURPLE_LIGHT = 'rgb(153, 91, 153)';
export const BRAND_PURPLE_BG = 'rgba(128, 51, 128, 0.1)';

export const TEXT_PRIMARY = 'rgba(65, 52, 65, 0.87)';
export const TEXT_SECONDARY = 'rgba(65, 52, 65, 0.72)';
export const TEXT_DISABLED = 'rgba(65, 52, 65, 0.40)';

export const BG_PAGE = 'rgb(245, 245, 245)';
export const BG_SURFACE = 'rgb(241, 241, 241)';
export const BORDER_COLOR = 'rgb(232, 232, 232)';

// ── MUI theme ─────────────────────────────────────────────────────────────────
export const theme = createTheme({
  palette: {
    primary: {
      main: BRAND_PURPLE,
      dark: BRAND_PURPLE_DARK,
      light: BRAND_PURPLE_LIGHT,
    },
    background: {
      default: BG_PAGE,
      paper: '#fff',
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_DISABLED,
    },
    divider: BORDER_COLOR,
  },
  typography: {
    fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
    body1: { fontSize: 16, fontWeight: 400, lineHeight: '24px', color: TEXT_PRIMARY },
    body2: { fontSize: 14, fontWeight: 400, lineHeight: '20px', color: TEXT_PRIMARY },
    caption: { fontSize: 12, fontWeight: 400, color: TEXT_SECONDARY },
    h6: { fontSize: 16, fontWeight: 700, lineHeight: '28px', color: TEXT_PRIMARY },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: 14,
          borderRadius: 4,
        },
        outlinedPrimary: {
          border: '0.91px solid rgba(128, 51, 128, 0.5)',
          padding: '5px 15px',
          '&:hover': { borderColor: BRAND_PURPLE, backgroundColor: 'rgba(128,51,128,0.05)' },
        },
        textPrimary: {
          padding: '6px 8px',
          '&:hover': { backgroundColor: 'rgba(128,51,128,0.05)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 16, height: 24, fontSize: 13 },
        colorPrimary: { backgroundColor: BRAND_PURPLE, color: '#fff' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${BORDER_COLOR}`,
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BG_SURFACE,
          color: TEXT_PRIMARY,
          boxShadow:
            'rgba(0,0,0,0.2) 0px 2px 4px -1px, rgba(0,0,0,0.14) 0px 4px 5px 0px, rgba(0,0,0,0.12) 0px 1px 10px 0px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: BORDER_COLOR } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: 14, color: TEXT_PRIMARY, borderColor: BORDER_COLOR },
        head: { fontWeight: 600 },
      },
    },
  },
});

// ── Notification design tokens ────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  action_required: '#C0392B',
  new_reports: '#0F6E56',
  fyi: BRAND_PURPLE,
} as const;

export const CATEGORY_LABELS = {
  action_required: 'Action Required',
  new_reports: 'New Reports',
  fyi: 'Updates',
} as const;

export const SUBTYPE_LABELS = {
  past_closing_date: 'Past closing date',
  phase_transition: 'Phase transition',
  parameter_change: 'Parameter change',
  report_ready: 'Report ready',
  object_assigned: 'Object assigned',
} as const;

export const SUBTYPE_PILL_COLORS: Record<string, { bg: string; color: string }> = {
  object_assigned:  { bg: 'rgba(128,51,128,0.1)',  color: BRAND_PURPLE },
  parameter_change: { bg: 'rgba(128,51,128,0.1)',  color: BRAND_PURPLE },
  phase_transition: { bg: '#FFEDD5', color: '#9A3412' },
  report_ready:     { bg: '#D1FAE5', color: '#065F46' },
  past_closing_date:{ bg: '#FEE2E2', color: '#991B1B' },
};

export const STATUS_BADGE_COLORS = {
  new:         { bg: 'rgb(129, 199, 132)', color: 'rgba(0,0,0,0.87)' },
  in_progress: { bg: '#FEF3C7',            color: '#92400E' },
  resolved:    { bg: '#D1FAE5',            color: '#065F46' },
} as const;
