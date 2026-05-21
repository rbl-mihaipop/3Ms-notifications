import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import type { NotificationCategory } from '@shared/types/mockDataTypes';
import type { Notification } from '@shared/types/mockDataTypes';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectItemsByTab,
  selectTabCounts,
  selectUnreadCount,
  setTab,
  markAllAsRead,
  selectActiveTab,
} from '../state/slices/notificationsSlice';
import { BRAND_PURPLE, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR } from '../theme/theme';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { ReportDetailModal } from '../components/notifications/ReportDetailModal';

const TABS: Array<{ value: NotificationCategory; label: string }> = [
  { value: 'action_required', label: 'Action required' },
  { value: 'new_reports', label: 'New reports' },
  { value: 'fyi', label: 'Updates' },
];

const TAB_DESCRIPTIONS: Record<NotificationCategory, string> = {
  action_required: 'Items where you need to take action in the project itself',
  new_reports: 'Reports that have been generated and are ready to view',
  fyi: 'Changes to your portfolio you should know about — no action required',
};

const formatGroupDate = (d: Date) =>
  d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();

const groupByDate = (items: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: Array<{ label: string; items: Notification[] }> = [];
  const ensureGroup = (label: string) => {
    let g = groups.find((x) => x.label === label);
    if (!g) {
      g = { label, items: [] };
      groups.push(g);
    }
    return g;
  };

  for (const item of items) {
    const d = new Date(item.createdAt);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let label: string;
    if (day.getTime() === today.getTime()) {
      label = `TODAY · ${formatGroupDate(today)}`;
    } else if (day.getTime() === yesterday.getTime()) {
      label = `YESTERDAY · ${formatGroupDate(yesterday)}`;
    } else if (day.getTime() > weekAgo.getTime()) {
      label = 'EARLIER THIS WEEK';
    } else {
      label = formatGroupDate(day);
    }
    ensureGroup(label).items.push(item);
  }

  return groups;
};

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeTab = useAppSelector(selectActiveTab);
  const items = useAppSelector(selectItemsByTab);
  const counts = useAppSelector(selectTabCounts);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [modalReportId, setModalReportId] = useState<string | null>(null);

  const handleCtaClick = (notification: Notification) => {
    if (notification.category === 'new_reports') {
      setModalReportId(notification.relatedEntityId);
    } else if (notification.relatedEntityId.startsWith('bld-')) {
      navigate(`/master-data?object=${notification.relatedEntityId}`);
    }
  };

  const pinnedItems = items.filter((n) => n.pinned);
  const unpinnedItems = items.filter((n) => !n.pinned);
  const dateGroups = groupByDate(unpinnedItems);
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 1.5,
        overflow: 'hidden',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tabs row */}
      <Box sx={{ borderBottom: `1px solid ${BORDER_COLOR}`, px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => dispatch(setTab(v))}
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 0.5,
              minHeight: 48,
              px: 0,
              mr: 3.5,
              color: TEXT_SECONDARY,
            },
            '& .Mui-selected': { color: `${BRAND_PURPLE} !important` },
            '& .MuiTabs-indicator': { bgcolor: BRAND_PURPLE, height: 2 },
          }}
        >
          {TABS.map(({ value, label }) => (
            <Tab
              key={value}
              value={value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <span>{label}</span>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: activeTab === value ? BRAND_PURPLE : '#E5E7EB',
                      color: activeTab === value ? '#fff' : '#6B7280',
                      borderRadius: '10px',
                      px: 0.75,
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: '18px',
                      minWidth: 18,
                      textAlign: 'center',
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
      <Box sx={{ px: 3, pt: 2.25, pb: 2, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <NotificationsNoneIcon sx={{ fontSize: 22, color: BRAND_PURPLE, mt: 0.25 }} />
            <Box>
              <Typography variant="body1" fontWeight={700} fontSize={16} color={TEXT_PRIMARY}>
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, color: TEXT_SECONDARY }}>
                {TAB_DESCRIPTIONS[activeTab]}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: TEXT_SECONDARY }}>
              <FilterAltOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => dispatch(markAllAsRead())}
                sx={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', px: 1 }}
              >
                Mark all as read
              </Button>
            )}
            <IconButton size="small" sx={{ color: TEXT_SECONDARY }}>
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
      <Box sx={{ flex: 1 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.disabled" fontSize={13}>
              No notifications in this category
            </Typography>
          </Box>
        ) : (
          <>
            {pinnedItems.length > 0 && (
              <>
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#6B7280',
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    Pinned
                  </Typography>
                </Box>
                {pinnedItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onCtaClick={handleCtaClick} />
                ))}
              </>
            )}

            {dateGroups.map(({ label, items: groupItems }) => (
              <Box key={label}>
                <Box sx={{ px: 3, pt: 2.25, pb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#6B7280',
                      letterSpacing: 0.8,
                    }}
                  >
                    {label}
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

      <ReportDetailModal reportId={modalReportId} onClose={() => setModalReportId(null)} />
    </Box>
  );
};
