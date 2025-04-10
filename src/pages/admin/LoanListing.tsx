import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import LoanService, { Loan, LoanFilter } from '../../service/LoanService';
import DealerService from '../../service/DealerService';

interface LoanListingProps {
  dealerId?: number;
}

const LoanListing: React.FC<LoanListingProps> = ({ dealerId }) => {
  const { id } = useParams<{ id: string }>();
  const specificDealerId = dealerId || (id ? parseInt(id) : undefined);
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [dealerName, setDealerName] = useState<string>('');
  
  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState<string>('');
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [filterMinAmount, setFilterMinAmount] = useState<string>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        let data: Loan[];
        
        if (specificDealerId) {
          data = await LoanService.getLoansByDealer(specificDealerId);
          
          // If we're viewing a specific dealer's loans, get the dealer name
          try {
            const dealerData = await DealerService.getDealerById(specificDealerId);
            setDealerName(dealerData.name);
          } catch (err) {
            console.error('Error fetching dealer details:', err);
          }
        } else {
          data = await LoanService.getAllLoans();
        }
        
        setLoans(data);
        setFilteredLoans(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loans. Please try again later.');
        setLoading(false);
      }
    };

    fetchLoans();
  }, [specificDealerId]);

  // Apply search filter whenever searchTerm changes
  // useEffect(() => {
  //   const filtered = loans.filter(loan =>
  //     loan.dealerName.includes(searchTerm.toLowerCase()) ||
  //     loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (loan.vehicleInfo && loan.vehicleInfo.registrationNumber && 
  //       loan.vehicleInfo.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  //   );
  //   setFilteredLoans(filtered);
  //   setPage(0);
  // }, [searchTerm, loans]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return {
      totalLoans: loans.length,
      totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
      activeLoans: loans.filter(loan => loan.isActive).length,
      inactiveLoans: loans.filter(loan => !loan.isActive).length,
      totalVehicleValue: loans.reduce((sum, loan) => 
        sum + (loan.vehicleInfo ? loan.vehicleInfo.value : 0), 0),
    };
  }, [loans]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/loan-details/${id}`);
  };

  const handleEditLoan = (id: number) => {
    navigate(`/edit-loan/${id}`);
  };

  const handleDeleteLoan = (id: number) => {
    // Could add confirmation dialog here
    console.log(`Delete loan with ID: ${id}`);
  };

  const handleApplyFilters = () => {
    const filters: LoanFilter = {};
    
    if (specificDealerId) filters.dealerId = specificDealerId;
    if (filterActive === 'active') filters.isActive = true;
    if (filterActive === 'inactive') filters.isActive = false;
    if (filterMinAmount) filters.minAmount = parseFloat(filterMinAmount);
    if (filterMaxAmount) filters.maxAmount = parseFloat(filterMaxAmount);
    if (filterFromDate) filters.fromDate = filterFromDate.toISOString();
    if (filterToDate) filters.toDate = filterToDate.toISOString();
    
    const filtered = LoanService.filterLoans(loans, filters);
    setFilteredLoans(filtered);
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilterActive('');
    setFilterFromDate(null);
    setFilterToDate(null);
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setFilteredLoans(loans);
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        {specificDealerId ? (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Loans for {dealerName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              View all loans issued to this dealer
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Loan Management</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              View and manage all loans
            </Typography>
          </>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Total Loans</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.totalLoans}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleOutlineIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">Active Loans</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.activeLoans}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ErrorOutlineIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="body2" color="text.secondary">Closed Loans</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.inactiveLoans}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DirectionsCarIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body2" color="text.secondary">Total Vehicle Value</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.totalVehicleValue.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search by dealer, loan number or registration"
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
        <Button 
          startIcon={<FilterListIcon />}
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {/* Filter Panel */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Filter Loans</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterActive}
                  label="Status"
                  onChange={(e) => setFilterActive(e.target.value as string)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
        
            
        
            
            <Grid item xs={12} md={3}>
              <TextField
                label="Min Amount"
                type="number"
                fullWidth
                size="small"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                label="Max Amount"
                type="number"
                fullWidth
                size="small"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleResetFilters}>Reset</Button>
            <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
          </Box>
        </Paper>
      )}

      {/* Loan List */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Loan Number</TableCell>
                    {!specificDealerId && <TableCell>Dealer</TableCell>}
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Interest Rate</TableCell>
                    <TableCell>Withdraw Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoans
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((loan) => (
                      <TableRow hover key={loan.id}>
                        <TableCell>{loan.loanNumber}</TableCell>
                        {!specificDealerId && <TableCell>{loan.dealerName}</TableCell>}
                        <TableCell>
                          {loan.vehicleInfo ? (
                            <Tooltip title={`${loan.vehicleInfo.make} ${loan.vehicleInfo.model} (${loan.vehicleInfo.year})`}>
                              <span>{loan.vehicleInfo.registrationNumber}</span>
                            </Tooltip>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {loan.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          })}
                        </TableCell>
                        <TableCell>{loan.interestRate}%</TableCell>
                        <TableCell>{formatDate(loan.dateOfWithdraw)}</TableCell>
                        <TableCell>{formatDate(loan.dueDate)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={loan.isActive ? 'Active' : 'Closed'} 
                            size="small" 
                            color={loan.isActive ? 'success' : 'default'}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(loan.id)}
                                sx={{ color: '#1e3a8a' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Loan">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditLoan(loan.id)}
                                sx={{ color: '#2e7d32' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Loan">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteLoan(loan.id)}
                                sx={{ color: '#d32f2f' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredLoans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={specificDealerId ? 8 : 9} align="center" sx={{ py: 3 }}>
                        No loans found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredLoans.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </MainLayout>
  );
};

export default LoanListing;