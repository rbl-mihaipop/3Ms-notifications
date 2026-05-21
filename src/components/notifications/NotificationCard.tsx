import { Box, Typography, Button, Chip } from '@mui/material';
import type { Notification } from '@shared/types/mockDataTypes';
import {
  CATEGORY_COLORS,
  SUBTYPE_LABELS,
  STATUS_BADGE_COLORS,
} from '../../theme/theme';
import { useAppDispatch } from '../../app/hooks';
import { markAsRead } from '../../state/slices/notificationsSlice';

interface Props {
  notification: Notification;
  onCtaClick?: (notification: Notification) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NotificationCard = ({ notification, onCtaClick }: Props) => {
  const dispatch = useAppDispatch();
  const categoryColor = CATEGORY_COLORS[notification.category];
  const subtypeLabel = SUBTYPE_LABELS[notification.subtype];
  const badgeStyle = STATUS_BADGE_COLORS[notification.statusBadge];
  const isUnread = notification.status === 'unread';

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
        bgcolor: isUnread ? '#FAFAFA' : '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 2,
        borderLeft: `4px solid ${categoryColor}`,
        cursor: 'pointer',
        mb: 1.5,
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: '#F9FAFB' },
      }}
    >
      <Box sx={{ flex: 1, p: 2 }}>
        {/* Top row: subtype label + status badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
          <Typography
            data-testid="notification-subtype"
            variant="caption"
            fontWeight={600}
            letterSpacing={0.8}
            sx={{ color: categoryColor, fontSize: 10 }}
          >
            {subtypeLabel}
          </Typography>
          <Chip
            data-testid="notification-status-badge"
            label={notification.statusBadge.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: badgeStyle.bg,
              color: badgeStyle.color,
              fontSize: 11,
              fontWeight: 500,
              height: 22,
              textTransform: 'capitalize',
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          fontWeight={isUnread ? 600 : 400}
          color="text.primary"
          sx={{ mb: 0.5, lineHeight: 1.5 }}
        >
          {notification.title}
        </Typography>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: 13, lineHeight: 1.5 }}>
          {notification.description}
        </Typography>

        {/* Optional note */}
        {notification.note && (
          <Box
            sx={{
              bgcolor: '#F3F4F6',
              borderRadius: 1,
              px: 1.5,
              py: 1,
              mb: 0.75,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {notification.note}
            </Typography>
          </Box>
        )}

        {/* Entity + timestamp */}
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 12 }}>
          {notification.entityName}&nbsp;&nbsp;·&nbsp;&nbsp;{notification.entityId}
          &nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(notification.createdAt)}
        </Typography>

        {/* CTA */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            data-testid="notification-cta"
            size="small"
            variant="outlined"
            onClick={handleCtaClick}
            sx={{
              borderColor: categoryColor,
              color: categoryColor,
              fontSize: 12,
              py: 0.25,
              '&:hover': { borderColor: categoryColor, bgcolor: `${categoryColor}10` },
            }}
          >
            {notification.ctaLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
