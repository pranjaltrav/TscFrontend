// src/pages/dashboard/DashboardMain.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import MainLayout from '../../components/layout/MainLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = '#1e3a8a' }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
              {value}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 0.5, 
                    color: trend >= 0 ? 'success.main' : 'error.main' 
                  }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}15`, // Light color with 15% opacity
              color: color,
              p: 1,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Chart component to mimic the bar charts in the image
const BarChart: React.FC<{ color: string }> = ({ color }) => {
  // Mock data for the chart
  const bars = [
    { height: 40 }, { height: 80 }, { height: 60 }, { height: 90 }, 
    { height: 70 }, { height: 50 }, { height: 85 }, { height: 65 }
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, mt: 2 }}>
      {bars.map((bar, index) => (
        <Box 
          key={index} 
          sx={{ 
            width: 20, 
            height: `${bar.height}%`, 
            backgroundColor: color, 
            borderRadius: 1,
            opacity: index % 2 === 0 ? 1 : 0.3 // Alternate between full and light color
          }} 
        />
      ))}
    </Box>
  );
};

// Line chart component to mimic the line chart in the image
const LineChart: React.FC = () => {
  return (
    <svg width="100%" height="120" viewBox="0 0 300 120">
      <path
        d="M0,100 L50,80 L100,30 L150,60 L200,20 L250,50 L300,10"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="3"
      />
      <path
        d="M0,100 L50,80 L100,30 L150,60 L200,20 L250,50 L300,10 L300,120 L0,120 Z"
        fill="url(#gradient)"
        opacity="0.2"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Recent messages component
const RecentMessages: React.FC = () => {
  const messages = [
    { 
      name: 'Leslie Alexander', 
      message: 'How can I return package', 
      status: 'Answered', 
      time: '12.45pm',
      avatar: '/path/to/avatar1.jpg'
    },
    { 
      name: 'Robert Foxeriest', 
      message: 'Question About the product', 
      status: 'Pending', 
      time: '3.45pm',
      avatar: '/path/to/avatar2.jpg'
    },
    { 
      name: 'Brooklyn Simmons', 
      message: 'Discount Code', 
      status: 'Pending', 
      time: 'Yesterday',
      avatar: '/path/to/avatar3.jpg'
    }
  ];

  return (
    <Card sx={{ mt: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Messages</Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {messages.map((message, index) => (
            <React.Fragment key={message.name}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={message.status} 
                      size="small"
                      sx={{ 
                        bgcolor: message.status === 'Answered' ? 'success.light' : 'warning.light',
                        color: message.status === 'Answered' ? 'success.dark' : 'warning.dark',
                        fontWeight: 500,
                        mb: 1
                      }} 
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {message.time}
                    </Typography>
                  </Box>
                }
                sx={{ py: 1.5 }}
              >
                <ListItemAvatar>
                  <Avatar>{message.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={message.name}
                  secondary={message.message}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
              {index < messages.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const DashboardMain: React.FC = () => {
  const [tabValue, setTabValue] = useState('loan');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome Back, John
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Loan" value="loan" />
          <Tab label="Cars" value="cars" />
          <Tab label="Dealer" value="dealer" />
        </Tabs>

        <TabPanel value={tabValue} index="loan">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Sanction Limit" 
                value="$2400.50" 
                icon={<AttachMoneyIcon />}
                trend={5.2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Available Limit" 
                value="$1850.20" 
                icon={<AccountBalanceWalletIcon />}
                trend={-3.8}
                color="#FF5722"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Amount Due" 
                value="$5678" 
                icon={<AccessTimeIcon />}
                trend={7.1}
                color="#2196F3"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Revenue</Typography>
                    <IconButton size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>$2400.50</Typography>
                  <BarChart color="#3f51b5" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Expenses</Typography>
                    <IconButton size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>$1850.20</Typography>
                  <BarChart color="#e91e63" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Sales</Typography>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>$5678</Typography>
                  <LineChart />
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>M</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>T</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>W</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>T</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>F</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>S</Box>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>S</Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index="cars">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="All Cars" 
                value="325" 
                icon={<DirectionsCarIcon />}
                trend={8.3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Active Cars" 
                value="278" 
                icon={<DirectionsCarIcon />}
                trend={4.5}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Rejected Cars" 
                value="47" 
                icon={<DirectionsCarIcon />}
                trend={-2.1}
                color="#F44336"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index="dealer">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="All Dealers" 
                value="75" 
                icon={<PeopleIcon />}
                trend={12.8}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Active Dealers" 
                value="62" 
                icon={<PeopleIcon />}
                trend={7.2}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Closed Dealers" 
                value="13" 
                icon={<PeopleIcon />}
                trend={-1.5}
                color="#F44336"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <RecentMessages />
    </MainLayout>
  );
};

export default DashboardMain;