import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LogoutIcon from '@mui/icons-material/Logout';
import CircleIcon from '@mui/icons-material/Circle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open = true }) => {
  const drawerWidth = 240;
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu for admin
  const adminMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Dealer Master', icon: <PeopleIcon />, path: '/dealer-listing' },
    { text: 'Loan Master', icon: <AccountBalanceIcon />, path: '/loan-listing' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'User Master', icon: <SecurityIcon />, path: '/user-listing' },
    { text: 'User Roles', icon: <AdminPanelSettingsIcon />, path: '/user-roles' },
    { text: 'Followup Items', icon: <FormatListBulletedIcon />, path: '/followup-items' },
  ];

  // Menu for dealer
  const dealerMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dealer/dashboard' },
    { text: 'Loans', icon: <AccountBalanceIcon />, path: '/dealer/loans' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/dealer/reports' },
    { text: 'Wallet', icon: <AccountBalanceIcon />, path: '/dealer/wallet' },
  ];

  const menuItems = currentUser.role === 'admin' ? adminMenu : dealerMenu;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1e3a8a',
          color: 'white',
          borderRadius: '0 50px 50px 0px',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <CircleIcon sx={{ color: '#1e3a8a', fontSize: 30 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          TSC
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                m: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
