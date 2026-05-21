import { Box, Typography, Chip, IconButton, Link } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EastIcon from '@mui/icons-material/East';
import type { Notification } from '@shared/types/mockDataTypes';
import {
  BRAND_PURPLE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER_COLOR,
  SUBTYPE_LABELS,
  SUBTYPE_PILL_COLORS,
  STATUS_BADGE_COLORS,
  STATUS_BADGE_LABELS,
} from '../../theme/theme';
import { useAppDispatch } from '../../app/hooks';
import { markAsRead } from '../../state/slices/notificationsSlice';

interface Props {
  notification: Notification;
  onCtaClick?: (notification: Notification) => void;
}

const formatCloseDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const daysOverdue = (expectedCloseDate: string) => {
  const expected = new Date(expectedCloseDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - expected) / (1000 * 60 * 60 * 24)));
};

export const NotificationCard = ({ notification, onCtaClick }: Props) => {
  const dispatch = useAppDispatch();
  const isUnread = notification.status === 'unread';
  const subtypeLabel = SUBTYPE_LABELS[notification.subtype];
  const statusBadgeColors = STATUS_BADGE_COLORS[notification.statusBadge];
  const pill = SUBTYPE_PILL_COLORS[notification.subtype] ?? {
    bg: '#E5E7EB',
    color: '#374151',
  };
  const overdue = notification.expectedCloseDate
    ? daysOverdue(notification.expectedCloseDate)
    : null;

  const handleCardClick = () => {
    if (isUnread) dispatch(markAsRead(notification.id));
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAsRead(notification.id));
    onCtaClick?.(notification);
  };

  return (
    <Box
      data-testid="notification-card"
      onClick={handleCardClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        py: 1.75,
        px: 3,
        borderBottom: `1px solid ${BORDER_COLOR}`,
        cursor: 'pointer',
        bgcolor: '#fff',
        '&:hover': { bgcolor: 'rgba(128,51,128,0.03)' },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: isUnread ? BRAND_PURPLE : 'transparent',
          flexShrink: 0,
          mt: 1.1,
        }}
      />

      <Chip
        data-testid="notification-subtype"
        label={subtypeLabel}
        size="small"
        sx={{
          bgcolor: pill.bg,
          color: pill.color,
          fontWeight: 500,
          fontSize: 11,
          height: 22,
          borderRadius: '11px',
          flexShrink: 0,
          mt: 0.25,
          '& .MuiChip-label': { px: 1.25 },
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            fontWeight={isUnread ? 600 : 400}
            sx={{ fontSize: 14, lineHeight: '20px', color: TEXT_PRIMARY }}
          >
            {notification.title}
          </Typography>
          <Chip
            label={STATUS_BADGE_LABELS[notification.statusBadge]}
            size="small"
            sx={{
              bgcolor: statusBadgeColors.bg,
              color: statusBadgeColors.color,
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              textTransform: 'capitalize',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        {notification.valueChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, my: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
              {notification.valueChange.label}
            </Typography>
            <Box component="span" sx={{ bgcolor: '#F3F4F6', color: '#6B7280', fontSize: 12, fontWeight: 600, px: 0.75, py: 0.25, borderRadius: 0.75, textDecoration: 'line-through' }}>
              {notification.valueChange.from}
            </Box>
            <EastIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            <Box component="span" sx={{ bgcolor: '#EDE9FE', color: BRAND_PURPLE, fontSize: 12, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 0.75 }}>
              {notification.valueChange.to}
            </Box>
          </Box>
        )}

        <Typography sx={{ fontSize: 12, color: TEXT_SECONDARY, lineHeight: '20px' }}>
          {notification.description}
        </Typography>

        {notification.expectedCloseDate && (
          <Typography sx={{ fontSize: 12, color: TEXT_SECONDARY, mt: 0.5 }}>
            Expected close {formatCloseDate(notification.expectedCloseDate)}
            {overdue !== null && overdue > 0 && (
              <>
                {' · '}
                <Box component="span" sx={{ color: '#DC2626', fontWeight: 500 }}>
                  {overdue} {overdue === 1 ? 'day' : 'days'} overdue
                </Box>
              </>
            )}
          </Typography>
        )}

        {notification.clearCondition && (
          <Typography sx={{ display: 'block', color: TEXT_SECONDARY, fontStyle: 'italic', fontSize: 12, mt: 0.5 }}>
            {notification.clearCondition}
          </Typography>
        )}
      </Box>

      <Link
        data-testid="notification-cta"
        component="button"
        onClick={handleCtaClick}
        sx={{
          color: BRAND_PURPLE,
          fontWeight: 500,
          fontSize: 13,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          mt: 0.25,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {notification.ctaLabel} →
      </Link>

      <IconButton
        size="small"
        onClick={(e) => e.stopPropagation()}
        sx={{ color: TEXT_SECONDARY, p: 0.5, mt: 0.1, flexShrink: 0 }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};
