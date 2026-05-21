import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  IconButton,
  Avatar,
  Chip,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectUnreadCount } from '../state/slices/notificationsSlice';

const SIDEBAR_WIDTH = 232;

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      {
        label: 'Portfolio',
        path: '/portfolio',
        children: [
          { label: 'Overview', path: '/portfolio/overview' },
          {
            label: 'Stock',
            children: [
              { label: 'Master data', path: '/portfolio/master-data' },
              { label: 'Operational data', path: '/portfolio/operational-data' },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Lifecycle',
    items: [
      { label: 'Building condition', path: '/lifecycle/building-condition' },
      { label: 'Sustainability', path: '/lifecycle/sustainability' },
      { label: 'Cost development', path: '/lifecycle/cost-development' },
    ],
  },
  {
    label: 'Investment planning',
    items: [
      { label: 'Investment planner', path: '/investment/planner' },
      { label: 'Time schedule', path: '/investment/schedule' },
    ],
  },
];

interface NavItemProps {
  label: string;
  path?: string;
  depth?: number;
  children?: Array<{ label: string; path?: string; children?: unknown[] }>;
}

const NavItem = ({ label, path, depth = 0, children }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = children && children.length > 0;
  const active = path ? location.pathname === path : false;

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            if (hasChildren) setOpen((o) => !o);
            else if (path) navigate(path);
          }}
          sx={{
            pl: 1.5 + depth * 1.5,
            py: 0.6,
            borderRadius: 1,
            mx: 0.75,
            color: active ? '#6D28D9' : '#374151',
            bgcolor: active ? '#EDE9FE' : 'transparent',
            '&:hover': { bgcolor: active ? '#EDE9FE' : '#F3F4F6' },
            fontSize: 13,
          }}
        >
          <ListItemText
            primary={label}
            primaryTypographyProps={{ fontSize: 13, fontWeight: active ? 500 : 400 }}
          />
          {hasChildren && (
            open
              ? <ExpandMoreIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
              : <ChevronRightIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {(children as NavItemProps[]).map((child) => (
              <NavItem key={child.label} {...child} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppSelector(selectUnreadCount);
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

        {/* Nav sections */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
          {NAV_SECTIONS.map((section, i) => (
            <Box key={i} sx={{ mb: 0.5 }}>
              {section.label && (
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#9CA3AF',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    px: 2,
                    pt: 1.5,
                    pb: 0.5,
                  }}
                >
                  {section.label}
                </Typography>
              )}
              <List disablePadding>
                {section.items.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
              </List>
            </Box>
          ))}

          <Divider sx={{ my: 1 }} />

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

          <Divider sx={{ my: 1 }} />

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: '#9CA3AF',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              px: 2,
              pt: 0.5,
              pb: 0.5,
            }}
          >
            Expertise
          </Typography>
        </Box>

        {/* Minimise navigation */}
        <Divider />
        <ListItemButton sx={{ py: 1, px: 2, color: '#6B7280', fontSize: 13 }}>
          <ChevronLeftIcon sx={{ fontSize: 16, mr: 0.75 }} />
          <Typography fontSize={13}>Minimise navigation</Typography>
        </ListItemButton>
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
