import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUnreadCount } from '../state/slices/notificationsSlice';

const SIDEBAR_WIDTH = 232;

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppSelector(selectUnreadCount);
  const isMasterData = location.pathname === '/master-data';
  const isNotifications = location.pathname === '/notifications';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: '#fff',
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 2 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              bgcolor: '#2D8B57',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>s</Typography>
          </Box>
          <Typography fontWeight={600} fontSize={15} letterSpacing={0.3}>
            stratus
          </Typography>
        </Box>

        <Divider />

        {/* Nav */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/master-data')}
                sx={{
                  pl: 1.5,
                  py: 0.6,
                  borderRadius: 1,
                  mx: 0.75,
                  color: isMasterData ? '#6D28D9' : '#374151',
                  bgcolor: isMasterData ? '#EDE9FE' : 'transparent',
                  '&:hover': { bgcolor: isMasterData ? '#EDE9FE' : '#F3F4F6' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <DomainOutlinedIcon sx={{ fontSize: 18, color: isMasterData ? '#6D28D9' : '#6B7280' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Master Data"
                  primaryTypographyProps={{ fontSize: 13, fontWeight: isMasterData ? 500 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Notifications */}
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/notifications')}
                sx={{
                  pl: 1.5,
                  py: 0.6,
                  borderRadius: 1,
                  mx: 0.75,
                  color: isNotifications ? '#6D28D9' : '#374151',
                  bgcolor: isNotifications ? '#EDE9FE' : 'transparent',
                  '&:hover': { bgcolor: isNotifications ? '#EDE9FE' : '#F3F4F6' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <NotificationsNoneIcon sx={{ fontSize: 18, color: isNotifications ? '#6D28D9' : '#6B7280' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  primaryTypographyProps={{ fontSize: 13, fontWeight: isNotifications ? 500 : 400 }}
                />
                {unreadCount > 0 && (
                  <Box
                    data-testid="notification-badge"
                    sx={{
                      bgcolor: '#EF4444',
                      color: '#fff',
                      borderRadius: '10px',
                      px: 0.75,
                      fontSize: 11,
                      fontWeight: 600,
                      lineHeight: '18px',
                      minWidth: 18,
                      textAlign: 'center',
                    }}
                  >
                    {unreadCount}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top-right controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.25,
            borderBottom: '1px solid #E5E7EB',
            bgcolor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Chip label="DEV" size="small" variant="outlined" sx={{ fontSize: 11, height: 22, fontWeight: 600, color: '#6B7280', borderColor: '#D1D5DB' }} />
          <IconButton size="small">
            <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
          </IconButton>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#374151', fontSize: 12 }}>SK</Avatar>
        </Box>

        <Box component="main" sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
