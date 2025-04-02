import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Box,
  Avatar,
  IconButton,
  Divider,
  Tabs,
  Tab
} from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Mock data for dealer's inventory
const mockInventory = [
  { id: "1", make: "Toyota", model: "Camry", year: 2025, price: 28500, status: "Available" },
  { id: "2", make: "Honda", model: "Accord", year: 2024, price: 27000, status: "Pending" },
  { id: "3", make: "Ford", model: "Escape", year: 2025, price: 31200, status: "Available" },
  { id: "4", make: "Chevrolet", model: "Malibu", year: 2024, price: 25800, status: "Available" },
  { id: "5", make: "Nissan", model: "Altima", year: 2025, price: 26400, status: "Sold" },
];

// Mock data for loans
const mockLoans = [
  { id: "101", customerName: "Mike Johnson", amount: 25000, status: "Active", startDate: "2025-01-15", endDate: "2030-01-15", vehicle: "Toyota Camry" },
  { id: "102", customerName: "Lisa Brown", amount: 18500, status: "Active", startDate: "2025-02-10", endDate: "2028-02-10", vehicle: "Honda Civic" },
  { id: "103", customerName: "David Wilson", amount: 32000, status: "Pending", startDate: "2025-03-01", endDate: "2030-03-01", vehicle: "Ford F-150" },
  { id: "104", customerName: "Sarah Davis", amount: 22000, status: "Active", startDate: "2025-01-20", endDate: "2028-01-20", vehicle: "Chevrolet Equinox" },
  { id: "105", customerName: "Chris Evans", amount: 35000, status: "Pending", startDate: "2025-02-25", endDate: "2031-02-25", vehicle: "Nissan Rogue" },
];

// Mock data for customer inquiries
const mockInquiries = [
  { id: "201", customerName: "Jennifer Lopez", email: "jlopez@example.com", date: "2025-03-15", status: "New", subject: "Interest in Ford Escape" },
  { id: "202", customerName: "Michael Smith", email: "msmith@example.com", date: "2025-03-14", status: "Responded", subject: "Financing options" },
  { id: "203", customerName: "Emily Rodriguez", email: "erodriguez@example.com", date: "2025-03-12", status: "Closed", subject: "Test drive appointment" },
];

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

// Bar chart component
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

const DealerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState('overview');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Get selected vehicle
  const selectedVehicle = mockInventory.find((vehicle) => vehicle.id === selectedVehicleId);

  // Calculate totals for stats
  const totalVehicles = mockInventory.length;
  const availableVehicles = mockInventory.filter(vehicle => vehicle.status === "Available").length;
  const activeLoans = mockLoans.filter(loan => loan.status === "Active").length;
  const totalLoanAmount = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
  
  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dealer Dashboard</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome, {currentUser?.name || 'Dealer'}
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
          <Tab label="Overview" value="overview" />
          <Tab label="Inventory" value="inventory" />
          <Tab label="Loans" value="loans" />
          <Tab label="Inquiries" value="inquiries" />
        </Tabs>

        <TabPanel value={tabValue} index="overview">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Vehicles" 
                value={totalVehicles.toString()} 
                icon={<DirectionsCarIcon />}
                trend={6.2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Available Vehicles" 
                value={availableVehicles.toString()} 
                icon={<DirectionsCarIcon />}
                trend={-2.8}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Active Loans" 
                value={activeLoans.toString()} 
                icon={<AttachMoneyIcon />}
                trend={7.1}
                color="#FF5722"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Monthly Sales</Typography>
                    <IconButton size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>$142,500</Typography>
                  <BarChart color="#3f51b5" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Loan Value</Typography>
                    <IconButton size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>${totalLoanAmount.toLocaleString()}</Typography>
                  <BarChart color="#e91e63" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Customer Inquiries</Typography>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>{mockInquiries.length}</Typography>
                  <LineChart />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Mon</Typography>
                    <Typography variant="caption" color="text.secondary">Wed</Typography>
                    <Typography variant="caption" color="text.secondary">Fri</Typography>
                    <Typography variant="caption" color="text.secondary">Sun</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index="inventory">
          <Grid container>
            <Grid item xs={12} md={8} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Vehicle Inventory</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Make/Model</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockInventory.map((vehicle) => (
                        <TableRow
                          key={vehicle.id}
                          hover
                          selected={selectedVehicleId === vehicle.id}
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                          sx={{ 
                            cursor: "pointer", 
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(30, 58, 138, 0.08)'
                            },
                            '&.Mui-selected:hover': {
                              backgroundColor: 'rgba(30, 58, 138, 0.12)'
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: '#1e3a8a' }}>
                                <DirectionsCarIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              {vehicle.make} {vehicle.model}
                            </Box>
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={vehicle.status} 
                              size="small" 
                              sx={{ 
                                bgcolor: vehicle.status === "Available" ? 'success.light' : 
                                        vehicle.status === "Pending" ? 'warning.light' : 'info.light',
                                color: vehicle.status === "Available" ? 'success.dark' : 
                                      vehicle.status === "Pending" ? 'warning.dark' : 'info.dark',
                                fontWeight: 500
                              }} 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Vehicle Details</Typography>
                  <IconButton size="small">
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {selectedVehicle ? (
                  <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#1e3a8a', width: 40, height: 40 }}>
                        <DirectionsCarIcon />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{selectedVehicle.make} {selectedVehicle.model}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedVehicle.year} Model</Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Price</Typography>
                        <Typography variant="h6">${selectedVehicle.price.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip 
                          label={selectedVehicle.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: selectedVehicle.status === "Available" ? 'success.light' : 
                                    selectedVehicle.status === "Pending" ? 'warning.light' : 'info.light',
                            color: selectedVehicle.status === "Available" ? 'success.dark' : 
                                  selectedVehicle.status === "Pending" ? 'warning.dark' : 'info.dark',
                            fontWeight: 500
                          }} 
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="outlined" size="small">Update Status</Button>
                      <Button variant="contained" size="small" sx={{ bgcolor: '#1e3a8a' }}>Details</Button>
                    </Box>
                  </Card>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 8
                  }}>
                    <DirectionsCarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      Select a vehicle to view details
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index="loans">
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Active Loans</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1e3a8a' }}>
                            {loan.customerName.charAt(0)}
                          </Avatar>
                          {loan.customerName}
                        </Box>
                      </TableCell>
                      <TableCell>{loan.vehicle}</TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.startDate}</TableCell>
                      <TableCell>{loan.endDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={loan.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: loan.status === "Active" ? 'success.light' : 'warning.light',
                            color: loan.status === "Active" ? 'success.dark' : 'warning.dark',
                            fontWeight: 500
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box sx={{ p: 2, mt: 3 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Loan Statistics</Typography>
                  <IconButton size="small">
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <StatCard 
                      title="Total Loan Amount" 
                      value={`$${totalLoanAmount.toLocaleString()}`} 
                      icon={<AttachMoneyIcon />}
                      trend={5.2}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StatCard 
                      title="Average Loan Size" 
                      value={`$${(totalLoanAmount / mockLoans.length).toLocaleString()}`} 
                      icon={<AccountBalanceWalletIcon />}
                      trend={3.8}
                      color="#FF5722"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StatCard 
                      title="Pending Approvals" 
                      value={mockLoans.filter(loan => loan.status === "Pending").length.toString()} 
                      icon={<AccessTimeIcon />}
                      trend={-2.5}
                      color="#2196F3"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index="inquiries">
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Customer Inquiries</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1e3a8a' }}>
                            {inquiry.customerName.charAt(0)}
                          </Avatar>
                          {inquiry.customerName}
                        </Box>
                      </TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.subject}</TableCell>
                      <TableCell>{inquiry.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={inquiry.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: inquiry.status === "New" ? 'info.light' : 
                                   inquiry.status === "Responded" ? 'success.light' : 'text.disabled',
                            color: inquiry.status === "New" ? 'info.dark' : 
                                 inquiry.status === "Responded" ? 'success.dark' : 'text.primary',
                            fontWeight: 500
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small"
                          disabled={inquiry.status === "Closed"}
                        >
                          {inquiry.status === "New" ? "Respond" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box sx={{ p: 2, mt: 3 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Inquiry Summary</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                        <Typography variant="h5" color="info.dark">
                          {mockInquiries.filter(i => i.status === "New").length}
                        </Typography>
                        <Typography variant="body2" color="info.dark">New</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="h5" color="success.dark">
                          {mockInquiries.filter(i => i.status === "Responded").length}
                        </Typography>
                        <Typography variant="body2" color="success.dark">Responded</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="h5" color="text.secondary">
                          {mockInquiries.filter(i => i.status === "Closed").length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Closed</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>

      {/* Additional chart card */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Monthly Vehicle Sales</Typography>
            <IconButton size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Summary of vehicle sales for the current year
          </Typography>
          <BarChart color="#1e3a8a" />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default DealerDashboard;