import { useState } from 'react';
import { Box, Typography, Chip, IconButton, Link, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EastIcon from '@mui/icons-material/East';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SnoozeIcon from '@mui/icons-material/Snooze';
import EventIcon from '@mui/icons-material/Event';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
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
import { markAsRead, dismiss, togglePin } from '../../state/slices/notificationsSlice';

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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isUnread = notification.status === 'unread';
  const subtypeLabel = SUBTYPE_LABELS[notification.subtype];
  const statusBadgeColors = STATUS_BADGE_COLORS[notification.statusBadge];
  const pill = SUBTYPE_PILL_COLORS[notification.subtype] ?? { bg: '#E5E7EB', color: TEXT_SECONDARY };
  const overdue = notification.expectedCloseDate ? daysOverdue(notification.expectedCloseDate) : null;

  const handleCardClick = () => {
    if (isUnread) dispatch(markAsRead(notification.id));
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAsRead(notification.id));
    onCtaClick?.(notification);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAnchor(null);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAsRead(notification.id));
    setMenuAnchor(null);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(dismiss(notification.id));
    setMenuAnchor(null);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAsRead(notification.id));
    onCtaClick?.(notification);
    setMenuAnchor(null);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(togglePin(notification.id));
    setMenuAnchor(null);
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
            <Typography sx={{ fontSize: 12, color: TEXT_SECONDARY, fontWeight: 500 }}>
              {notification.valueChange.label}
            </Typography>
            <Box component="span" sx={{ bgcolor: '#F3F4F6', color: TEXT_SECONDARY, fontSize: 12, fontWeight: 600, px: 0.75, py: 0.25, borderRadius: 0.75, textDecoration: 'line-through' }}>
              {notification.valueChange.from}
            </Box>
            <EastIcon sx={{ fontSize: 13, color: TEXT_SECONDARY }} />
            <Box component="span" sx={{ bgcolor: 'rgba(128,51,128,0.1)', color: BRAND_PURPLE, fontSize: 12, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 0.75 }}>
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

<<<<<<< HEAD
=======
      {/* Kebab menu button */}
>>>>>>> aa9ae7d (more actions)
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{ color: TEXT_SECONDARY, p: 0.5, mt: 0.1, flexShrink: 0 }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px',
              borderRadius: 1,
              border: `1px solid ${BORDER_COLOR}`,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notification.category === 'new_reports' && (
          <MenuItem onClick={handleDownload} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <DownloadOutlinedIcon sx={{ fontSize: 16, color: BRAND_PURPLE }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              Download
            </ListItemText>
          </MenuItem>
        )}

        {notification.category === 'action_required' && [
          <MenuItem key="snooze3" onClick={handleMenuClose} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <SnoozeIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              Snooze for 3 days
            </ListItemText>
          </MenuItem>,
          <MenuItem key="snoozeClose" onClick={handleMenuClose} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <EventIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              Snooze until closing date
            </ListItemText>
          </MenuItem>,
          <MenuItem key="pin" onClick={handleTogglePin} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <PushPinOutlinedIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              {notification.pinned ? 'Unpin' : 'Pin'}
            </ListItemText>
          </MenuItem>,
        ]}

        <MenuItem onClick={handleMarkAsRead} disabled={!isUnread} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DoneIcon sx={{ fontSize: 16, color: BRAND_PURPLE }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
            Mark as read
          </ListItemText>
        </MenuItem>

        {notification.category === 'action_required' && (
          <MenuItem onClick={handleMenuClose} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FlagOutlinedIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              Report as incorrect
            </ListItemText>
          </MenuItem>
        )}

        {notification.category !== 'action_required' && (
          <MenuItem onClick={handleDismiss} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CloseIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 14, color: TEXT_PRIMARY }}>
              Dismiss notification
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
