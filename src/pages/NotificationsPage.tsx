import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import type { NotificationCategory } from '@shared/types/mockDataTypes';
import type { Notification } from '@shared/types/mockDataTypes';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectItemsByTab,
  selectTabCounts,
  selectUnreadCount,
  setTab,
  markAllAsRead,
  selectActiveTab,
} from '../state/slices/notificationsSlice';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../theme/theme';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { ReportDetailModal } from '../components/notifications/ReportDetailModal';

const TABS: Array<{ value: NotificationCategory | 'all'; label: string }> = [
  { value: 'action_required', label: 'Action Required' },
  { value: 'new_reports', label: 'New Reports' },
  { value: 'fyi', label: 'FYI' },
];

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const items = useAppSelector(selectItemsByTab);
  const counts = useAppSelector(selectTabCounts);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [modalReportId, setModalReportId] = useState<string | null>(null);

  const handleCtaClick = (notification: Notification) => {
    if (notification.category === 'new_reports') {
      setModalReportId(notification.relatedEntityId);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link underline="hover" color="text.secondary" href="/notifications" sx={{ fontSize: 13 }}>
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ fontSize: 13 }}>
          Notifications
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" fontWeight={600}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(markAllAsRead())}
            sx={{ color: '#374151', borderColor: '#D1D5DB', fontSize: 13 }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
        {TABS.map(({ value, label }) => {
          const count = counts[value as NotificationCategory];
          if (!count) return null;
          return (
            <Chip
              key={value}
              label={`${count} ${label}`}
              onClick={() => dispatch(setTab(value))}
              sx={{
                bgcolor: activeTab === value ? CATEGORY_COLORS[value as NotificationCategory] : '#F3F4F6',
                color: activeTab === value ? '#fff' : '#374151',
                fontWeight: 500,
                fontSize: 13,
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
            />
          );
        })}
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => dispatch(setTab(v))}
        sx={{
          borderBottom: '1px solid #E5E7EB',
          mb: 2,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 400, fontSize: 14, minHeight: 44 },
          '& .Mui-selected': { fontWeight: 600 },
        }}
      >
        {TABS.map(({ value, label }) => (
          <Tab
            key={value}
            value={value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {label}
                <Box
                  component="span"
                  sx={{
                    bgcolor: activeTab === value
                      ? CATEGORY_COLORS[value as NotificationCategory]
                      : '#E5E7EB',
                    color: activeTab === value ? '#fff' : '#6B7280',
                    borderRadius: '10px',
                    px: 0.75,
                    py: 0.1,
                    fontSize: 11,
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  {counts[value as NotificationCategory]}
                </Box>
              </Box>
            }
            sx={{ color: activeTab === value ? CATEGORY_COLORS[value as NotificationCategory] : '#6B7280' }}
          />
        ))}
      </Tabs>

      {/* Notification list */}
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.disabled">No notifications in this category</Typography>
        </Box>
      ) : (
        <Box>
          {items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onCtaClick={handleCtaClick}
            />
          ))}
        </Box>
      )}

      {/* Report detail modal */}
      <ReportDetailModal
        reportId={modalReportId}
        onClose={() => setModalReportId(null)}
      />
    </Box>
  );
};
