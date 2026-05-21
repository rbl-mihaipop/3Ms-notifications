import { Box, Typography, Chip, IconButton, Link } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Notification } from '@shared/types/mockDataTypes';
import { CATEGORY_COLORS, STATUS_BADGE_COLORS, SUBTYPE_LABELS } from '../../theme/theme';
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

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const daysOverdue = (expectedCloseDate: string) => {
  const expected = new Date(expectedCloseDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - expected) / (1000 * 60 * 60 * 24)));
};

export const NotificationCard = ({ notification, onCtaClick }: Props) => {
  const dispatch = useAppDispatch();
  const isUnread = notification.status === 'unread';
  const categoryColor = CATEGORY_COLORS[notification.category];
  const subtypeLabel = SUBTYPE_LABELS[notification.subtype];
  const statusBadgeColors = STATUS_BADGE_COLORS[notification.statusBadge];
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
        py: 1.5,
        px: 2,
        borderBottom: '1px solid #F3F4F6',
        cursor: 'pointer',
        bgcolor: isUnread ? '#FEFEFE' : '#fff',
        '&:hover': { bgcolor: '#F9FAFB' },
        gap: 1.25,
      }}
    >
      {/* Unread dot */}
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: isUnread ? '#3B82F6' : 'transparent',
          flexShrink: 0,
          mt: 0.9,
        }}
      />

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Top row: subtype pill + title + CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
          <Chip
            data-testid="notification-subtype"
            label={subtypeLabel}
            size="small"
            sx={{
              bgcolor: `${categoryColor}18`,
              color: categoryColor,
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              letterSpacing: 0.3,
              flexShrink: 0,
            }}
          />
          <Chip
            label={notification.statusBadge.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: statusBadgeColors.bg,
              color: statusBadgeColors.color,
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              textTransform: 'capitalize',
            }}
          />
          <Typography
            variant="body2"
            fontWeight={isUnread ? 600 : 400}
            color="text.primary"
            sx={{ fontSize: 13, lineHeight: 1.4 }}
          >
            {notification.title}
          </Typography>
          <Link
            data-testid="notification-cta"
            component="button"
            variant="body2"
            onClick={handleCtaClick}
            sx={{
              color: '#374151',
              fontWeight: 500,
              fontSize: 13,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': { color: categoryColor, textDecoration: 'underline' },
            }}
          >
            {notification.ctaLabel} →
          </Link>
        </Box>

        {/* Meta line: expected close + days overdue + time */}
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 12 }}>
          {notification.expectedCloseDate && (
            <>Expected close {formatCloseDate(notification.expectedCloseDate)}&nbsp;·&nbsp;</>
          )}
          {overdue !== null && overdue > 0 && (
            <Box component="span" sx={{ color: '#EF4444', fontWeight: 500 }}>
              {overdue} {overdue === 1 ? 'day' : 'days'} overdue
            </Box>
          )}
          {!notification.expectedCloseDate && (
            <>{notification.entityName}&nbsp;·&nbsp;{notification.entityId}</>
          )}
          &nbsp;·&nbsp;{formatTime(notification.createdAt)}
        </Typography>

        {/* Pinned clear condition */}
        {notification.clearCondition && (
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#9CA3AF', fontStyle: 'italic', fontSize: 11, mt: 0.25 }}
          >
            {notification.clearCondition}
          </Typography>
        )}
      </Box>

      {/* Right icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        <IconButton size="small" sx={{ p: 0.5, color: '#9CA3AF' }}>
          <LinkIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" sx={{ p: 0.5, color: '#9CA3AF' }}>
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
