import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Table, 
  TableBody,
  TableCell,
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MainLayout from '../../components/layout/MainLayout';
import DealerService, { Dealer } from '../../service/DealerService';

const DealerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealerDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await DealerService.getDealerById(Number(id));
        setDealer(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dealer details. Please try again later.');
        setLoading(false);
      }
    };

    fetchDealerDetails();
  }, [id]);

  const getStatusIcon = (status: number) => {
    switch(status) {
      case 1: // Assuming 1 is complete
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 2: // Assuming 2 is pending
        return <AccessTimeIcon sx={{ color: 'warning.main' }} />;
      default: // Assuming other values are incomplete
        return <ErrorIcon sx={{ color: 'error.main' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !dealer) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography color="error">{error || 'Dealer not found'}</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/dealer-listing')}
            sx={{ mt: 2 }}
          >
            Back to Listing
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          sx={{ cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </Link>
        <Link 
          color="inherit" 
          sx={{ cursor: 'pointer' }} 
          onClick={() => navigate('/dealer-listing')}
        >
          Dealers
        </Link>
        <Typography color="text.primary">{dealer.name}</Typography>
      </Breadcrumbs>
      
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/dealer-listing')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dealer Details</Typography>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Left side - Basic information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#1e3a8a', mr: 2 }}>
                  {dealer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{dealer.name}</Typography>
                  <Chip 
                    label={dealer.status} 
                    size="small" 
                    color={dealer.status === 'Active' ? 'success' : 'default'} 
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary">Dealer Code</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{dealer.dealerCode}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">PAN</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{dealer.pan}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Entity Type</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{dealer.entityType}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Location</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{dealer.location}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Relationship Manager</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{dealer.relationshipManager}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Date of Onboarding</Typography>
              <Typography variant="body1">{formatDate(dealer.dateOfOnboarding)}</Typography>
            </CardContent>
          </Card>
          
          {/* Status Information */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Status Information</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2">Document Status</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(dealer.documentStatus)}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {dealer.documentStatus === 1 ? 'Complete' : dealer.documentStatus === 2 ? 'Pending' : 'Incomplete'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Stock Audit Status</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(dealer.stockAuditStatus)}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {dealer.stockAuditStatus === 1 ? 'Complete' : dealer.stockAuditStatus === 2 ? 'Pending' : 'Incomplete'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right side - Financial information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2, p: 3, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Financial Overview</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Sanction Amount</Typography>
                  <Typography variant="h6" sx={{ color: '#1e3a8a' }}>
                    ${dealer.sanctionAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Available Limit</Typography>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>
                    ${dealer.availableLimit.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Outstanding Amount</Typography>
                  <Typography variant="h6" sx={{ color: 'warning.main' }}>
                    ${dealer.outstandingAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Principal Outstanding</Typography>
                  <Typography variant="h6">
                    ${dealer.principalOutstanding.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Rate of Interest</Typography>
                  <Typography variant="h6">
                    {dealer.roi}%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Delay ROI</Typography>
                  <Typography variant="h6">
                    {dealer.delayROI}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>Utilization</Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Utilization Percentage</Typography>
                <Typography variant="body2">{dealer.utilizationPercentage}%</Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: '#e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${dealer.utilizationPercentage}%`,
                    height: '100%',
                    bgcolor: dealer.utilizationPercentage > 80 ? 'error.main' : dealer.utilizationPercentage > 60 ? 'warning.main' : 'success.main',
                  }}
                />
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1">Payment Summary</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: '50%' }}>PF Received</TableCell>
                    <TableCell>${dealer.pfReceived.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interest Received</TableCell>
                    <TableCell>${dealer.interestReceived.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delay Interest Received</TableCell>
                    <TableCell>${dealer.delayInterestReceived.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amount Received</TableCell>
                    <TableCell>${dealer.amountReceived.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PF Accrued</TableCell>
                    <TableCell>${dealer.pfAcrued.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interest Accrued</TableCell>
                    <TableCell>${dealer.interestAccrued.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delay Interest Accrued</TableCell>
                    <TableCell>${dealer.delayInterestAccrued.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Waiver Amount</TableCell>
                    <TableCell>${dealer.waiverAmount.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Overdue Count</TableCell>
                    <TableCell>{dealer.overdueCount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default DealerDetails;