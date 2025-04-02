import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2, 
        textAlign: 'center', 
        bgcolor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Circle. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;