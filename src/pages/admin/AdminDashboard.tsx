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
  Divider
} from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

// Using the same mock data from your original file
const mockDealers = [
  { id: "1", name: "John Smith Auto", email: "john@smithauto.com", totalLoans: 24, activeLoans: 18 },
  { id: "2", name: "Elite Motors", email: "info@elitemotors.com", totalLoans: 32, activeLoans: 25 },
  { id: "3", name: "Prestige Autos", email: "sales@prestigeautos.com", totalLoans: 19, activeLoans: 12 },
  { id: "4", name: "City Car Center", email: "contact@citycar.com", totalLoans: 41, activeLoans: 30 },
  { id: "5", name: "Highway Motors", email: "support@highwaymotors.com", totalLoans: 15, activeLoans: 9 },
];

const mockLoans = [
  { id: "101", dealerId: "1", customerName: "Mike Johnson", amount: 25000, status: "Active", startDate: "2025-01-15", endDate: "2030-01-15" },
  { id: "102", dealerId: "2", customerName: "Lisa Brown", amount: 18500, status: "Active", startDate: "2025-02-10", endDate: "2028-02-10" },
  { id: "103", dealerId: "1", customerName: "David Wilson", amount: 32000, status: "Pending", startDate: "2025-03-01", endDate: "2030-03-01" },
  { id: "104", dealerId: "3", customerName: "Sarah Davis", amount: 22000, status: "Active", startDate: "2025-01-20", endDate: "2028-01-20" },
  { id: "105", dealerId: "4", customerName: "Chris Evans", amount: 35000, status: "Pending", startDate: "2025-02-25", endDate: "2031-02-25" },
  { id: "106", dealerId: "2", customerName: "Emily Rodriguez", amount: 27500, status: "Active", startDate: "2025-03-10", endDate: "2029-03-10" },
];

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

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);

  // Calculate totals for stats
  const totalDealers = mockDealers.length;
  const totalActiveLoans = mockDealers.reduce((sum, dealer) => sum + dealer.activeLoans, 0);
  const totalLoans = mockDealers.reduce((sum, dealer) => sum + dealer.totalLoans, 0);
  
  // Get selected dealer and their loans
  const selectedDealer = mockDealers.find((dealer) => dealer.id === selectedDealerId);
  const filteredLoans = selectedDealerId ? mockLoans.filter((loan) => loan.dealerId === selectedDealerId) : [];

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome, {currentUser?.name || 'Admin'}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Dealers" 
            value={totalDealers.toString()} 
            icon={<PeopleIcon />}
            trend={8.3}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Loans" 
            value={totalLoans.toString()} 
            icon={<AssignmentIcon />}
            trend={5.2}
            color="#FF5722"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Active Loans" 
            value={totalActiveLoans.toString()} 
            icon={<CheckCircleIcon />}
            trend={7.1}
            color="#4CAF50"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">Dealer Management</Typography>
        </Box>
        <Grid container>
          <Grid item xs={12} md={8} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Dealers</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dealer Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Total Loans</TableCell>
                      <TableCell>Active Loans</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockDealers.map((dealer) => (
                      <TableRow
                        key={dealer.id}
                        hover
                        selected={selectedDealerId === dealer.id}
                        onClick={() => setSelectedDealerId(dealer.id)}
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
                              {dealer.name.charAt(0)}
                            </Avatar>
                            {dealer.name}
                          </Box>
                        </TableCell>
                        <TableCell>{dealer.email}</TableCell>
                        <TableCell>{dealer.totalLoans}</TableCell>
                        <TableCell>
                          <Chip 
                            label={dealer.activeLoans.toString()} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'success.light',
                              color: 'success.dark',
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
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Dealer Details</Typography>
                <IconButton size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {selectedDealer ? (
                <>
                  <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#1e3a8a', width: 40, height: 40 }}>
                        {selectedDealer.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{selectedDealer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedDealer.email}</Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Total Loans</Typography>
                        <Typography variant="h6">{selectedDealer.totalLoans}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Active Loans</Typography>
                        <Typography variant="h6">{selectedDealer.activeLoans}</Typography>
                      </Grid>
                    </Grid>
                  </Card>
                  
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>Loans</Typography>
                  
                  {filteredLoans.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {filteredLoans.map((loan) => (
                        <Card key={loan.id} variant="outlined" sx={{ mb: 1.5, borderRadius: 1 }}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">Loan #{loan.id}</Typography>
                              <Chip 
                                label={loan.status} 
                                size="small" 
                                color={loan.status === "Active" ? "success" : "warning"}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Customer: {loan.customerName}
                            </Typography>
                            <Typography variant="h6" sx={{ my: 1, color: '#1e3a8a' }}>
                              ${loan.amount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                Start: {loan.startDate}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                End: {loan.endDate}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No loans available for this dealer
                    </Typography>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 8
                }}>
                  <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    Select a dealer to view details
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional chart card */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Monthly Loan Activity</Typography>
            <IconButton size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Summary of loan activity across all dealers
          </Typography>
          <BarChart color="#1e3a8a" />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AdminDashboard;