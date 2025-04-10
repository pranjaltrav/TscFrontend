import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Card, CardContent, Box, Avatar, IconButton, Divider, CircularProgress, TextField, InputAdornment, TablePagination } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddRepresentativeButton from "../../components/buttons/AddRepresentativeButton";
import DealerService from "../../service/DealerService";
import LoanService from "../../service/DealerService";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = '#1e3a8a', loading = false }) => {
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
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
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

// Bar chart component
const BarChart: React.FC<{ data: number[], color: string, loading: boolean }> = ({ data, color, loading }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, mt: 2 }}>
      {loading ? (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        data.map((value, index) => (
          <Box
            key={index}
            sx={{
              width: 20,
              height: `${(value / Math.max(...data)) * 90}%`,
              backgroundColor: color,
              borderRadius: 1,
              opacity: index % 2 === 0 ? 1 : 0.3 // Alternate between full and light color
            }}
          />
        ))
      )}
    </Box>
  );
};

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [dealers, setDealers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDealers, setFilteredDealers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Fetch dealers and loans
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dealers
        const dealersData = await DealerService.getAllDealers();
        setDealers(dealersData);
        setFilteredDealers(dealersData);

        // Fetch loans
        // const loansData = await LoanService.getAllLoans();
        // setLoans(loansData);

        // Generate chart data based on monthly loan counts
        // This would typically come from an API endpoint that provides this data
        // For now, we'll simulate it with random data
        const simulatedChartData = Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 90) + 10
        );
        setChartData(simulatedChartData);
        setChartLoading(false);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter dealers when search term changes
  useEffect(() => {
    const results = dealers.filter(dealer =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.dealerCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDealers(results);
    setPage(0);
  }, [searchTerm, dealers]);

  // Calculate totals for stats
  const totalDealers = dealers.length;
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;

  // Get selected dealer and their loans
  const selectedDealer = dealers.find((dealer) => dealer.id === selectedDealerId);
  const filteredLoans = selectedDealerId
    ? loans.filter((loan) => loan.dealerId === selectedDealerId)
    : [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refreshData = async () => {
    setChartLoading(true);
    setLoading(true);
    try {
      // Refresh dealers
      const dealersData = await DealerService.getAllDealers();
      setDealers(dealersData);
      setFilteredDealers(dealersData.filter(dealer =>
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.dealerCode?.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      // Refresh loans
      // const loansData = await LoanService.getAllLoans();
      // setLoans(loansData);

      // Refresh chart data
      const simulatedChartData = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 90) + 10
      );
      setChartData(simulatedChartData);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {currentUser?.name || 'Admin'}
          </Typography>
        </div>
        <AddRepresentativeButton />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Dealers"
            value={loading ? "..." : totalDealers.toString()}
            icon={<PeopleIcon />}
            trend={8.3}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Loans"
            value={loading ? "..." : totalLoans.toString()}
            icon={<AssignmentIcon />}
            trend={5.2}
            color="#FF5722"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Loans"
            value={loading ? "..." : activeLoans.toString()}
            icon={<CheckCircleIcon />}
            trend={7.1}
            color="#4CAF50"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search dealers by name or code"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '50%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Filter
          </Button>

          <Button
            startIcon={<RefreshIcon />}
            variant="contained"
            onClick={refreshData}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">Dealer Management</Typography>
        </Box>

        {error && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={refreshData}
            >
              Try Again
            </Button>
          </Box>
        )}

        {!error && (
          <Grid container>
            <Grid item xs={12} md={8} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Dealers</Typography>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Dealer Name</TableCell>
                            <TableCell>Dealer Code</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Outstanding Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredDealers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((dealer) => (
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
                                <TableCell>{dealer.dealerCode || 'N/A'}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={dealer.status}
                                    size="small"
                                    sx={{
                                      bgcolor: dealer.status === 'Active' ? 'success.light' :
                                        dealer.status === 'Inactive' ? 'error.light' : 'warning.light',
                                      color: dealer.status === 'Active' ? 'success.dark' :
                                        dealer.status === 'Inactive' ? 'error.dark' : 'warning.dark',
                                      fontWeight: 500
                                    }}
                                  />
                                </TableCell>
                                <TableCell>${(dealer.outstandingAmount || 0).toLocaleString()}</TableCell>
                              </TableRow>
                            ))}

                          {filteredDealers.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                {loading ? 'Loading...' : 'No dealers found'}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      component="div"
                      count={filteredDealers.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Dealer Details</Typography>
                  <IconButton size="small" onClick={() => selectedDealerId && refreshData()}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : selectedDealer ? (
                  <>
                    <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#1e3a8a', width: 40, height: 40 }}>
                          {selectedDealer.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{selectedDealer.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedDealer.email || 'No email available'}</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Dealer Code</Typography>
                          <Typography variant="h6">{selectedDealer.dealerCode || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <Typography variant="h6">{selectedDealer.status || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Outstanding</Typography>
                          <Typography variant="h6">${(selectedDealer.outstandingAmount || 0).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Sanction Amount</Typography>
                          <Typography variant="h6">${(selectedDealer.sanctionAmount || 0).toLocaleString()}</Typography>
                        </Grid>
                      </Grid>
                    </Card>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>Loans</Typography>

                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : filteredLoans.length > 0 ? (
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
                                Customer: {loan.customerName || 'N/A'}
                              </Typography>
                              <Typography variant="h6" sx={{ my: 1, color: '#1e3a8a' }}>
                                ${(loan.amount || 0).toLocaleString()}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                  Start: {loan.startDate || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  End: {loan.endDate || 'N/A'}
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
        )}
      </Paper>

      {/* Monthly Loan Activity Chart */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Monthly Loan Activity</Typography>
            <IconButton size="small" onClick={() => refreshData()} disabled={loading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Summary of loan activity across all dealers
          </Typography>
          <BarChart data={chartData} color="#1e3a8a" loading={chartLoading} />

          {/* Month labels */}
          {!chartLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => (
                <Typography key={index} variant="caption" color="text.secondary" sx={{ width: 20, textAlign: 'center' }}>
                  {month}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AdminDashboard;