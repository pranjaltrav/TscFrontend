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
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import AddRepresentativeButton from "../../components/buttons/AddRepresentativeButton";
import axios from 'axios';

interface Representative {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  userType: string;
  isActive: boolean;
  token: string | null;
}

interface EditRepresentativeData {
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

const RepresentativeListing: React.FC = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [filteredRepresentatives, setFilteredRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
  
  // Edit form states
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/Auth/representatives', {
          headers: {
            'Accept': 'text/plain'
          }
        });
        
        setRepresentatives(response.data);
        setFilteredRepresentatives(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch representatives. Please try again later.');
        setLoading(false);
      }
    };

    fetchRepresentatives();
  }, []);

  // Apply search filter whenever searchTerm changes
  useEffect(() => {
    const filtered = representatives.filter(rep =>
      rep.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.phoneNumber.includes(searchTerm)
    );
    setFilteredRepresentatives(filtered);
    setPage(0);
  }, [searchTerm, representatives]);

  // Calculate summary statistics
  const summaryStats = {
    totalRepresentatives: representatives.length,
    activeRepresentatives: representatives.filter(rep => rep.isActive).length,
    inactiveRepresentatives: representatives.filter(rep => !rep.isActive).length,
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await axios.get(`/api/Auth/representatives/${id}`, {
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      setSelectedRepresentative(response.data);
      setViewDialogOpen(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch representative details.',
        severity: 'error',
      });
    }
  };

  const handleEditOpen = async (id: number) => {
    try {
      const response = await axios.get(`/api/Auth/representatives/${id}`, {
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      setSelectedRepresentative(response.data);
      setEditEmail(response.data.email);
      setEditPhone(response.data.phoneNumber);
      setEditIsActive(response.data.isActive);
      setEditDialogOpen(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch representative details for editing.',
        severity: 'error',
      });
    }
  };

  const handleDeleteOpen = (rep: Representative) => {
    setSelectedRepresentative(rep);
    setDeleteDialogOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!selectedRepresentative) return;
    
    const editData: EditRepresentativeData = {
      email: editEmail,
      phoneNumber: editPhone,
      isActive: editIsActive
    };
    
    try {
      await axios.put(
        `/api/Auth/representatives/${selectedRepresentative.id}`,
        editData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      
      // Update local state
      const updatedRepresentatives = representatives.map(rep => 
        rep.id === selectedRepresentative.id 
          ? { ...rep, ...editData } 
          : rep
      );
      
      setRepresentatives(updatedRepresentatives);
      setFilteredRepresentatives(updatedRepresentatives);
      
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Representative updated successfully.',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update representative.',
        severity: 'error',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRepresentative) return;
    
    try {
      await axios.delete(`/api/Auth/representatives/${selectedRepresentative.id}`, {
        headers: {
          'Accept': '*/*'
        }
      });
      
      // Update local state
      const updatedRepresentatives = representatives.filter(
        rep => rep.id !== selectedRepresentative.id
      );
      
      setRepresentatives(updatedRepresentatives);
      setFilteredRepresentatives(updatedRepresentatives);
      
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Representative deleted successfully.',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete representative.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Representative Management</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage system representatives
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Total Representatives</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.totalRepresentatives}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">Active Representatives</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.activeRepresentatives}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="body2" color="text.secondary">Inactive Representatives</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {summaryStats.inactiveRepresentatives}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search by username, email or phone"
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
        <AddRepresentativeButton />
      </Box>

      {/* Representative List */}
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
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRepresentatives
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((rep) => (
                      <TableRow hover key={rep.id}>
                        <TableCell>{rep.id}</TableCell>
                        <TableCell>{rep.username}</TableCell>
                        <TableCell>{rep.email}</TableCell>
                        <TableCell>{rep.phoneNumber}</TableCell>
                        <TableCell>{rep.userType}</TableCell>
                        <TableCell>
                          <Chip 
                            label={rep.isActive ? 'Active' : 'Inactive'} 
                            size="small" 
                            color={rep.isActive ? 'success' : 'default'}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(rep.id)}
                                sx={{ color: '#1e3a8a' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Representative">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditOpen(rep.id)}
                                sx={{ color: '#2e7d32' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Representative">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteOpen(rep)}
                                sx={{ color: '#d32f2f' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredRepresentatives.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No representatives found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRepresentatives.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* View Representative Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Representative Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedRepresentative && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                <Typography variant="body1">{selectedRepresentative.id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                <Typography variant="body1">{selectedRepresentative.username}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedRepresentative.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1">{selectedRepresentative.phoneNumber}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">User Type</Typography>
                <Typography variant="body1">{selectedRepresentative.userType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedRepresentative.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={selectedRepresentative.isActive ? 'success' : 'default'}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Representative Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Representative
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>Status:</Typography>
              <Button
                variant={editIsActive ? "contained" : "outlined"}
                color="success"
                size="small"
                onClick={() => setEditIsActive(true)}
                sx={{ mr: 1 }}
              >
                Active
              </Button>
              <Button
                variant={!editIsActive ? "contained" : "outlined"}
                color="error"
                size="small"
                onClick={() => setEditIsActive(false)}
              >
                Inactive
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Representative Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete representative "{selectedRepresentative?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default RepresentativeListing;