import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar, 
  Box 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ visibility: 'hidden' }}>
          {/* Placeholder to balance the layout */}
          <Typography variant="h6">TSC</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: 3 }}>
            <IconButton color="inherit">
              <Badge variant="dot" color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt="John Smith" 
              src="/avatar-placeholder.jpg" 
              sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                John Smith
              </Typography>
              <Typography variant="caption" color="textSecondary">
                john@gmail.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;