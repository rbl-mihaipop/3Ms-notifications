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
import { BRAND_PURPLE, BRAND_PURPLE_BG, TEXT_PRIMARY, TEXT_SECONDARY, BG_SURFACE, BORDER_COLOR } from '../theme/theme';

const SIDEBAR_WIDTH = 300;

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppSelector(selectUnreadCount);
  const isMasterData = location.pathname.startsWith('/master-data');
  const isNotifications = location.pathname.startsWith('/notifications');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'rgb(245, 245, 245)' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: 'rgb(245, 245, 245)',
          borderRight: `1px solid ${BORDER_COLOR}`,
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
              bgcolor: BRAND_PURPLE,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>s</Typography>
          </Box>
          <Typography fontWeight={600} fontSize={15} letterSpacing={0.3} color={TEXT_PRIMARY}>
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
                  py: 0.75,
                  borderRadius: 1,
                  mx: 0.75,
                  color: isMasterData ? BRAND_PURPLE : TEXT_PRIMARY,
                  bgcolor: isMasterData ? BRAND_PURPLE_BG : 'transparent',
                  '&:hover': { bgcolor: isMasterData ? BRAND_PURPLE_BG : 'rgba(0,0,0,0.04)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <DomainOutlinedIcon sx={{ fontSize: 18, color: isMasterData ? BRAND_PURPLE : TEXT_SECONDARY }} />
                </ListItemIcon>
                <ListItemText
                  primary="Master Data"
                  primaryTypographyProps={{ fontSize: 16, fontWeight: isMasterData ? 600 : 400, color: isMasterData ? BRAND_PURPLE : TEXT_PRIMARY }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/notifications')}
                sx={{
                  pl: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  mx: 0.75,
                  color: isNotifications ? BRAND_PURPLE : TEXT_PRIMARY,
                  bgcolor: isNotifications ? BRAND_PURPLE_BG : 'transparent',
                  '&:hover': { bgcolor: isNotifications ? BRAND_PURPLE_BG : 'rgba(0,0,0,0.04)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <NotificationsNoneIcon sx={{ fontSize: 18, color: isNotifications ? BRAND_PURPLE : TEXT_SECONDARY }} />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  primaryTypographyProps={{ fontSize: 16, fontWeight: isNotifications ? 600 : 400, color: isNotifications ? BRAND_PURPLE : TEXT_PRIMARY }}
                />
                {unreadCount > 0 && (
                  <Box
                    data-testid="notification-badge"
                    sx={{
                      bgcolor: BRAND_PURPLE,
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
        {/* App bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.25,
            bgcolor: BG_SURFACE,
            boxShadow: 'rgba(0,0,0,0.2) 0px 2px 4px -1px, rgba(0,0,0,0.14) 0px 4px 5px 0px, rgba(0,0,0,0.12) 0px 1px 10px 0px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Chip label="DEV" size="small" variant="outlined" sx={{ fontSize: 11, height: 22, fontWeight: 600, color: TEXT_SECONDARY, borderColor: BORDER_COLOR }} />
          <IconButton size="small">
            <SettingsOutlinedIcon sx={{ fontSize: 18, color: TEXT_SECONDARY }} />
          </IconButton>
          <Avatar sx={{ width: 28, height: 28, bgcolor: BRAND_PURPLE, fontSize: 12 }}>SK</Avatar>
        </Box>

        <Box component="main" sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
