import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Link,
  IconButton,
  Alert,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { CATEGORY_COLORS } from '../theme/theme';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { ReportDetailModal } from '../components/notifications/ReportDetailModal';

const TABS: Array<{ value: NotificationCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new_reports', label: 'Reports' },
  { value: 'fyi', label: 'Assignments' },
  { value: 'action_required', label: 'Projects' },
];

const TAB_DESCRIPTIONS: Record<NotificationCategory | 'all', string> = {
  all: 'All notifications across reports, assignments, and projects',
  action_required: 'Items where you need to take action in the project itself',
  new_reports: 'Report notifications and generation status updates',
  fyi: 'Assignment updates for object/building manager changes',
};

const groupByDate = (items: Notification[]) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: Record<string, Notification[]> = {};

  items.forEach((item) => {
    const d = new Date(item.createdAt).toDateString();
    let label: string;
    if (d === today) {
      label = `TODAY – ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}`;
    } else if (d === yesterday) {
      label = 'YESTERDAY';
    } else {
      label = new Date(item.createdAt)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        .toUpperCase();
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
};

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

  const pinnedItems = items.filter((n) => n.pinned);
  const unpinnedItems = items.filter((n) => !n.pinned);
  const dateGroups = groupByDate(unpinnedItems);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs row */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #E5E7EB', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => dispatch(setTab(v))}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 400, fontSize: 13, minHeight: 44, px: 0, mr: 3 },
            '& .Mui-selected': { fontWeight: 600, color: '#111 !important' },
            '& .MuiTabs-indicator': { bgcolor: '#111' },
          }}
        >
          {TABS.map(({ value, label }) => (
            <Tab
              key={value}
              value={value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <span style={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 12 }}>
                    {label}
                  </span>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: activeTab === value ? '#111' : '#E5E7EB',
                      color: activeTab === value ? '#fff' : '#6B7280',
                      borderRadius: '10px',
                      px: 0.75,
                      fontSize: 11,
                      fontWeight: 600,
                      lineHeight: '18px',
                    }}
                  >
                    {counts[value]}
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Header */}
      <Box sx={{ bgcolor: '#fff', px: 3, pt: 2, pb: 1.5, borderBottom: '1px solid #F3F4F6' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsNoneIcon sx={{ fontSize: 20, color: '#6B7280' }} />
            <Box>
              <Typography variant="body1" fontWeight={600} fontSize={14}>
                Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize={12}>
                {TAB_DESCRIPTIONS[activeTab]}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: '#6B7280' }}>
              <FilterListIcon sx={{ fontSize: 18 }} />
            </IconButton>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={() => dispatch(markAllAsRead())}
                sx={{ color: '#374151', fontSize: 12, textTransform: 'none', fontWeight: 500, px: 1 }}
              >
                Mark all as read
              </Button>
            )}
            <IconButton size="small" sx={{ color: '#6B7280' }}>
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Info banner for action_required */}
      {activeTab === 'action_required' && (
        <Alert
          severity="warning"
          icon={false}
          sx={{
            bgcolor: '#FFFBEB',
            color: '#92400E',
            fontSize: 12,
            py: 0.75,
            px: 3,
            borderRadius: 0,
            borderBottom: '1px solid #FDE68A',
            '& .MuiAlert-message': { py: 0 },
          }}
        >
          These items clear automatically once you fix the underlying issue in the project.
        </Alert>
      )}

      {/* Notification list */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff' }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.disabled" fontSize={13}>No notifications in this category</Typography>
          </Box>
        ) : (
          <>
            {/* Pinned section */}
            {pinnedItems.length > 0 && (
              <>
                <Box sx={{ px: 2, py: 1, bgcolor: '#F9FAFB' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                    Pinned
                  </Typography>
                </Box>
                {pinnedItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onCtaClick={handleCtaClick} />
                ))}
              </>
            )}

            {/* Date-grouped sections */}
            {Object.entries(dateGroups).map(([dateLabel, groupItems]) => (
              <Box key={dateLabel}>
                <Box sx={{ px: 2, py: 1, bgcolor: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: 11, letterSpacing: 0.6 }}>
                    {dateLabel}
                  </Typography>
                </Box>
                {groupItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onCtaClick={handleCtaClick} />
                ))}
              </Box>
            ))}
          </>
        )}
      </Box>

      {/* Report detail modal */}
      <ReportDetailModal
        reportId={modalReportId}
        onClose={() => setModalReportId(null)}
      />
    </Box>
  );
};
