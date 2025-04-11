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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Snackbar,
  Alert
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
  
  // Edit Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
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

  const handleEditDealer = async (id: number) => {
    try {
      setEditLoading(true);
      const dealer = await DealerService.getDealerById(id);
      setSelectedDealer(dealer);
      setEditDialogOpen(true);
      setEditLoading(false);
    } catch (err) {
      console.error('Failed to fetch dealer details for editing:', err);
    }
  };

  const handleDeleteDealer = (id: number) => {
    // Implement delete functionality here
    // You might want to show a confirmation dialog before deletion
    console.log(`Delete dealer with ID: ${id}`);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedDealer(null);
    setEditError(null);
    setFormErrors({});
  };

  const handleDealerFieldChange = (field: keyof Dealer, value: any) => {
    if (selectedDealer) {
      setSelectedDealer({
        ...selectedDealer,
        [field]: value
      });
      
      // Clear field-specific error when user makes a change
      if (formErrors[field]) {
        setFormErrors({
          ...formErrors,
          [field]: ''
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!selectedDealer?.name?.trim()) {
      errors.name = 'Dealer name is required';
    }
    
    if (!selectedDealer?.dealerCode?.trim()) {
      errors.dealerCode = 'Dealer code is required';
    }
    
    if (!selectedDealer?.pan?.trim()) {
      errors.pan = 'PAN is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(selectedDealer.pan)) {
      errors.pan = 'Invalid PAN format';
    }
    
    if (selectedDealer?.sanctionAmount <= 0) {
      errors.sanctionAmount = 'Sanction amount must be greater than 0';
    }
    
    if (selectedDealer?.roi < 0) {
      errors.roi = 'ROI cannot be negative';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDealer = async () => {
    if (!selectedDealer || !validateForm()) {
      return;
    }
    
    try {
      setEditLoading(true);
      await DealerService.updateDealer(selectedDealer.id, selectedDealer);
      
      // Update dealer in the local state
      const updatedDealers = dealers.map(d => 
        d.id === selectedDealer.id ? selectedDealer : d
      );
      setDealers(updatedDealers);
      setFilteredDealers(updatedDealers.filter(dealer =>
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.dealerCode.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      setEditSuccess(true);
      handleCloseEditDialog();
    } catch (err) {
      console.error('Failed to update dealer:', err);
      setEditError('Failed to update dealer. Please try again.');
    } finally {
      setEditLoading(false);
    }
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

  const handleCloseSnackbar = () => {
    setEditSuccess(false);
    setEditError(null);
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
                ₹{dealers.reduce((sum, dealer) => sum + dealer.outstandingAmount, 0).toLocaleString()}
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
                    <TableCell>Sanction Amount</TableCell>
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
                        <TableCell>₹{dealer.outstandingAmount.toLocaleString()}</TableCell>
                        <TableCell>₹{dealer.sanctionAmount.toLocaleString()}</TableCell>
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

      {/* Edit Dealer Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Dealer
          {selectedDealer && (
            <Typography variant="subtitle2" color="text.secondary">
              ID: {selectedDealer.id} | Code: {selectedDealer.dealerCode}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {editLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedDealer ? (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Dealer Name"
                  fullWidth
                  value={selectedDealer.name}
                  onChange={(e) => handleDealerFieldChange('name', e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Dealer Code"
                  fullWidth
                  value={selectedDealer.dealerCode}
                  onChange={(e) => handleDealerFieldChange('dealerCode', e.target.value)}
                  error={!!formErrors.dealerCode}
                  helperText={formErrors.dealerCode}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Loan Proposal Number"
                  fullWidth
                  value={selectedDealer.loanProposalNo}
                  onChange={(e) => handleDealerFieldChange('loanProposalNo', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="PAN"
                  fullWidth
                  value={selectedDealer.pan}
                  onChange={(e) => handleDealerFieldChange('pan', e.target.value.toUpperCase())}
                  error={!!formErrors.pan}
                  helperText={formErrors.pan}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Entity Type</InputLabel>
                  <Select
                    value={selectedDealer.entityType}
                    label="Entity Type"
                    onChange={(e) => handleDealerFieldChange('entityType', e.target.value)}
                  >
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Proprietorship">Proprietorship</MenuItem>
                    <MenuItem value="Partnership">Partnership</MenuItem>
                    <MenuItem value="Corporation">Corporation</MenuItem>
                    <MenuItem value="LLP">LLP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Location"
                  fullWidth
                  value={selectedDealer.location}
                  onChange={(e) => handleDealerFieldChange('location', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Relationship Manager"
                  fullWidth
                  value={selectedDealer.relationshipManager}
                  onChange={(e) => handleDealerFieldChange('relationshipManager', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedDealer.status}
                    label="Status"
                    onChange={(e) => handleDealerFieldChange('status', e.target.value)}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Financial Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Financial Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="ROI (%)"
                  fullWidth
                  type="number"
                  value={selectedDealer.roi}
                  onChange={(e) => handleDealerFieldChange('roi', parseFloat(e.target.value))}
                  error={!!formErrors.roi}
                  helperText={formErrors.roi}
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Delay ROI (%)"
                  fullWidth
                  type="number"
                  value={selectedDealer.delayROI}
                  onChange={(e) => handleDealerFieldChange('delayROI', parseFloat(e.target.value))}
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Sanction Amount"
                  fullWidth
                  type="number"
                  value={selectedDealer.sanctionAmount}
                  onChange={(e) => handleDealerFieldChange('sanctionAmount', parseFloat(e.target.value))}
                  error={!!formErrors.sanctionAmount}
                  helperText={formErrors.sanctionAmount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Available Limit"
                  fullWidth
                  type="number"
                  value={selectedDealer.availableLimit}
                  onChange={(e) => handleDealerFieldChange('availableLimit', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Outstanding Amount"
                  fullWidth
                  type="number"
                  value={selectedDealer.outstandingAmount}
                  onChange={(e) => handleDealerFieldChange('outstandingAmount', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Waiver Amount"
                  fullWidth
                  type="number"
                  value={selectedDealer.waiverAmount}
                  onChange={(e) => handleDealerFieldChange('waiverAmount', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Utilization Percentage"
                  fullWidth
                  type="number"
                  value={selectedDealer.utilizationPercentage}
                  onChange={(e) => handleDealerFieldChange('utilizationPercentage', parseFloat(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Principal Outstanding"
                  fullWidth
                  type="number"
                  value={selectedDealer.principalOutstanding}
                  onChange={(e) => handleDealerFieldChange('principalOutstanding', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Overdue Count"
                  fullWidth
                  type="number"
                  value={selectedDealer.overdueCount}
                  onChange={(e) => handleDealerFieldChange('overdueCount', parseInt(e.target.value))}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography>No dealer selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveDealer} 
            variant="contained" 
            color="primary"
            disabled={editLoading || !selectedDealer}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar 
        open={editSuccess} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Dealer updated successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!editError} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {editError}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default DealerListing;