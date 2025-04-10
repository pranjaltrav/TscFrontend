import React, { useState, useEffect } from 'react';
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
  Stack,
  CircularProgress,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import LoanService from '../../service/LoanService';
import DealerService from '../../service/DealerService';

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
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = '#1e3a8a', isLoading = false }) => {
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
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <>
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
              </>
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
const BarChart: React.FC<{ color: string; data?: number[] }> = ({ color, data }) => {
  // Use provided data or fallback to mock data
  const chartData = data || [40, 80, 60, 90, 70, 50, 85, 65];

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, mt: 2 }}>
      {chartData.map((height, index) => (
        <Box 
          key={index} 
          sx={{ 
            width: 20, 
            height: `${height}%`, 
            backgroundColor: color, 
            borderRadius: 1,
            opacity: index % 2 === 0 ? 1 : 0.3 // Alternate between full and light color
          }} 
        />
      ))}
    </Box>
  );
};

// Line chart component with dynamic data
const LineChart: React.FC<{ data?: number[] }> = ({ data }) => {
  // Use provided data or fallback to mock data
  const chartData = data || [100, 80, 30, 60, 20, 50, 10];
  
  // Calculate points for the SVG path
  const maxValue = Math.max(...chartData);
  const points = chartData.map((value, index) => {
    const x = (index * 300) / (chartData.length - 1);
    const y = 100 - (value / maxValue) * 90; // Scale to 90% of the height
    return `${x},${y}`;
  }).join(' L ');

  const pathD = `M ${points}`;
  const areaD = `${pathD} L 300,120 L 0,120 Z`;

  return (
    <svg width="100%" height="120" viewBox="0 0 300 120">
      <path
        d={pathD}
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="3"
      />
      <path
        d={areaD}
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

// Recent Messages component with actual loan data
const RecentMessages: React.FC<{ loans?: any[]; isLoading?: boolean }> = ({ loans, isLoading }) => {
  const messages = loans ? loans.slice(0, 3).map(loan => ({
    name: loan.dealerName,
    message: `Loan #${loan.loanNumber} - ${loan.vehicleInfo?.make || 'Vehicle'} ${loan.vehicleInfo?.model || ''}`,
    status: loan.isActive ? 'Active' : 'Closed',
    time: new Date(loan.dateOfWithdraw).toLocaleDateString(),
    id: loan.id
  })) : [
    { 
      name: 'Leslie Alexander', 
      message: 'How can I return package', 
      status: 'Answered', 
      time: '12.45pm',
      id: 1
    },
    { 
      name: 'Robert Foxeriest', 
      message: 'Question About the product', 
      status: 'Pending', 
      time: '3.45pm',
      id: 2
    },
    { 
      name: 'Brooklyn Simmons', 
      message: 'Discount Code', 
      status: 'Pending', 
      time: 'Yesterday',
      id: 3
    }
  ];

  const navigate = useNavigate();

  const handleViewLoan = (id: number) => {
    navigate(`/loan-details/${id}`);
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Loan Activity</Typography>
          <Tooltip title="View All Loans">
            <IconButton size="small" onClick={() => navigate('/loans')}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                          bgcolor: message.status === 'Active' || message.status === 'Answered' ? 'success.light' : 'warning.light',
                          color: message.status === 'Active' || message.status === 'Answered' ? 'success.dark' : 'warning.dark',
                          fontWeight: 500,
                          mb: 1
                        }} 
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {message.time}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewLoan(message.id)}
                        sx={{ color: '#1e3a8a', mt: 0.5 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{ py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1e3a8a' }}>{message.name.charAt(0)}</Avatar>
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
        )}
      </CardContent>
    </Card>
  );
};

// Recent dealers component
const RecentDealers: React.FC<{ dealers?: any[]; isLoading?: boolean }> = ({ dealers, isLoading }) => {
  const navigate = useNavigate();

  const handleViewDealer = (id: number) => {
    navigate(`/dealer-details/${id}`);
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Active Dealers</Typography>
          <Tooltip title="View All Dealers">
            <IconButton size="small" onClick={() => navigate('/dealers')}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {(dealers || []).slice(0, 3).map((dealer, index) => (
              <React.Fragment key={dealer.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={dealer.status} 
                        size="small"
                        sx={{ 
                          bgcolor: dealer.status === 'Active' ? 'success.light' : 'warning.light',
                          color: dealer.status === 'Active' ? 'success.dark' : 'warning.dark',
                          fontWeight: 500,
                          mb: 1
                        }} 
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        ${dealer.outstandingAmount.toLocaleString()}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDealer(dealer.id)}
                        sx={{ color: '#1e3a8a', mt: 0.5 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{ py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1e3a8a' }}>{dealer.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={dealer.name}
                    secondary={`Code: ${dealer.dealerCode}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                {index < (dealers || []).slice(0, 3).length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardMain: React.FC = () => {
  const [tabValue, setTabValue] = useState('loan');
  const [loans, setLoans] = useState<any[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch loans and dealers data in parallel
        const [loansData, dealersData] = await Promise.all([
          LoanService.getAllLoans(),
          DealerService.getAllDealers()
        ]);
        
        setLoans(loansData);
        setDealers(dealersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Calculate metrics
  const loanMetrics = {
    totalSanctionLimit: loans.reduce((sum, loan) => sum + loan.amount, 0),
    totalAvailableLimit: dealers.reduce((sum, dealer) => sum + dealer.availableLimit, 0),
    amountDue: loans.filter(loan => loan.isActive).reduce((sum, loan) => sum + loan.amount, 0),
    revenueData: [40, 65, 75, 50, 80, 60, 90, 70], // Weekly revenue trend
    expensesData: [30, 50, 60, 40, 70, 50, 80, 60], // Weekly expenses trend
    salesData: [70, 50, 30, 60, 20, 50, 10], // Weekly sales trend
  };

  const carMetrics = {
    allCars: loans.filter(loan => loan.vehicleInfo).length,
    activeCars: loans.filter(loan => loan.vehicleInfo && loan.isActive).length,
    rejectedCars: loans.filter(loan => loan.vehicleInfo && !loan.isActive).length,
  };

  const dealerMetrics = {
    allDealers: dealers.length,
    activeDealers: dealers.filter(dealer => dealer.status === 'Active').length,
    closedDealers: dealers.filter(dealer => dealer.status !== 'Active').length,
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [loansData, dealersData] = await Promise.all([
        LoanService.getAllLoans(),
        DealerService.getAllDealers()
      ]);
      
      setLoans(loansData);
      setDealers(dealersData);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome Back, John
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
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
                value={loading ? "Loading..." : formatCurrency(loanMetrics.totalSanctionLimit)} 
                icon={<AttachMoneyIcon />}
                trend={5.2}
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Available Limit" 
                value={loading ? "Loading..." : formatCurrency(loanMetrics.totalAvailableLimit)} 
                icon={<AccountBalanceWalletIcon />}
                trend={-3.8}
                color="#FF5722"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Amount Due" 
                value={loading ? "Loading..." : formatCurrency(loanMetrics.amountDue)} 
                icon={<AccessTimeIcon />}
                trend={7.1}
                color="#2196F3"
                isLoading={loading}
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
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {formatCurrency(loanMetrics.totalSanctionLimit * 0.10)} {/* Assuming 10% of total as revenue */}
                      </Typography>
                      <BarChart color="#3f51b5" data={loanMetrics.revenueData} />
                    </>
                  )}
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
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {formatCurrency(loanMetrics.totalSanctionLimit * 0.05)} {/* Assuming 5% of total as expenses */}
                      </Typography>
                      <BarChart color="#e91e63" data={loanMetrics.expensesData} />
                    </>
                  )}
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
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {formatCurrency(loans.length * 2500)} {/* Average sale value per loan */}
                      </Typography>
                      <LineChart data={loanMetrics.salesData} />
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>M</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>T</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>W</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>T</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>F</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>S</Box>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>S</Box>
                      </Stack>
                    </>
                  )}
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
                value={loading ? "Loading..." : carMetrics.allCars.toString()} 
                icon={<DirectionsCarIcon />}
                trend={8.3}
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Active Cars" 
                value={loading ? "Loading..." : carMetrics.activeCars.toString()} 
                icon={<DirectionsCarIcon />}
                trend={4.5}
                color="#4CAF50"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Rejected Cars" 
                value={loading ? "Loading..." : carMetrics.rejectedCars.toString()} 
                icon={<DirectionsCarIcon />}
                trend={-2.1}
                color="#F44336"
                isLoading={loading}
              />
            </Grid>
            
            {/* Vehicle Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Vehicle Makes</Typography>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end' }}>
                      {/* Simplified chart showing vehicle makes distribution */}
                      <Box sx={{ flex: 1, height: '70%', bgcolor: '#3f51b5', mx: 1, borderRadius: 1 }} />
                      <Box sx={{ flex: 1, height: '85%', bgcolor: '#f44336', mx: 1, borderRadius: 1 }} />
                      <Box sx={{ flex: 1, height: '50%', bgcolor: '#4caf50', mx: 1, borderRadius: 1 }} />
                      <Box sx={{ flex: 1, height: '65%', bgcolor: '#ff9800', mx: 1, borderRadius: 1 }} />
                      <Box sx={{ flex: 1, height: '45%', bgcolor: '#9c27b0', mx: 1, borderRadius: 1 }} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Vehicle Age Distribution */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Vehicle Age Distribution</Typography>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ height: 250 }}>
                      <LineChart data={[30, 60, 90, 70, 40, 20, 10]} />
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">0-1 yr</Typography>
                        <Typography variant="caption">1-2 yr</Typography>
                        <Typography variant="caption">2-3 yr</Typography>
                        <Typography variant="caption">3-4 yr</Typography>
                        <Typography variant="caption">4-5 yr</Typography>
                        <Typography variant="caption">5+ yr</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <RecentMessages />
    </MainLayout>
  );
};

export default DashboardMain;