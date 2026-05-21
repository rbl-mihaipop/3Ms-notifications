import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Box, Button } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUnreadCount } from '../state/slices/notificationsSlice';

const NAV_LINKS = [
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Assets', path: '/assets' },
  { label: 'Deals', path: '/deals' },
  { label: 'Reports', path: '/reports' },
  { label: 'Notifications', path: '/notifications' },
];

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppSelector(selectUnreadCount);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 4 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            letterSpacing={1.5}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => navigate('/notifications')}
          >
            STRATUS
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: active ? '#111' : '#6B7280',
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                    borderBottom: active ? '2px solid #111' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5,
                    pb: 0.5,
                    '&:hover': { color: '#111', bgcolor: 'transparent' },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/notifications')} size="small">
              <Badge
                badgeContent={unreadCount || null}
                color="error"
                data-testid="notification-badge"
              >
                <NotificationsNoneIcon sx={{ color: '#374151' }} />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#374151', fontSize: 13 }}>
              MP
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};
