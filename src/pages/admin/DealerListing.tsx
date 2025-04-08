import React, { useState, useEffect } from 'react';
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
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import DealerService, { Dealer } from '../../service/DealerService';

const DealerListing: React.FC = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [filteredDealers, setFilteredDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        const data = await DealerService.getAllDealers();
        setDealers(data);
        setFilteredDealers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dealers. Please try again later.');
        setLoading(false);
      }
    };

    fetchDealers();
  }, []);

  useEffect(() => {
    const results = dealers.filter(dealer =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.dealerCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDealers(results);
    setPage(0);
  }, [searchTerm, dealers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dealer-details/${id}`);
  };

  const handleEditDealer = (id: number) => {
    navigate(`/edit-dealer/${id}`);
  };

  const handleDeleteDealer = (id: number) => {
    // Implement delete functionality here
    // You might want to show a confirmation dialog before deletion
    console.log(`Delete dealer with ID: ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dealer Management</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage all registered dealers
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Dealers</Typography>
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                {dealers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Active Dealers</Typography>
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                {dealers.filter(d => d.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Outstanding</Typography>
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                ${dealers.reduce((sum, dealer) => sum + dealer.outstandingAmount, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search by name or code"
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
        >
          Filter
        </Button>
      </Box>

      {/* Dealer List */}
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
                    <TableCell>S.No</TableCell>
                    <TableCell>Dealer</TableCell>
                    <TableCell>Dealer Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Outstanding Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDealers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dealer, index) => (
                      <TableRow hover key={dealer.id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1e3a8a' }}>
                              {dealer.name.charAt(0)}
                            </Avatar>
                            {dealer.name}
                          </Box>
                        </TableCell>
                        <TableCell>{dealer.dealerCode}</TableCell>
                        <TableCell>
                          <Chip 
                            label={dealer.status} 
                            size="small" 
                            color={getStatusColor(dealer.status) as any}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>${dealer.outstandingAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(dealer.id)}
                                sx={{ color: '#1e3a8a' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Dealer">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditDealer(dealer.id)}
                                sx={{ color: '#2e7d32' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Dealer">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteDealer(dealer.id)}
                                sx={{ color: '#d32f2f' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredDealers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No dealers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDealers.length}
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

export default DealerListing;