import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { SelectChangeEvent } from "@mui/material/Select";
import { useAuth } from '../../context/AuthContext';
import { formatISO } from 'date-fns';
import { generateDealerCode, generateLoanProposalNo } from '../../utils/codeGenerators';
import { DealerService } from '../../service/DealerService';

// Entity type options
const entityTypes = [
  'Proprietorship',
  'Partnership',
  'HUF',
  'Private Limited',
  'Limited',
  'LLP'
];

// Mock locations (replace with API data)
const locations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad'
];

interface DealerOnboardingDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DealerOnboardingFormData {
  dealerCode: string;
  loanProposalNo: string;
  name: string;
  dateOfOnboarding: string;
  pan: string;
  entityType: string;
  location: string;
  relationshipManager: string;
  status: string;
  roi: number;
  delayROI: number;
  sanctionAmount: number;
  isActive: boolean;
}

const DealerOnboardingDialog: React.FC<DealerOnboardingDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form data
  const [formData, setFormData] = useState<DealerOnboardingFormData>({
    dealerCode: generateDealerCode(),
    loanProposalNo: generateLoanProposalNo(),
    name: currentUser?.name || '',
    dateOfOnboarding: formatISO(new Date()).split('T')[0],
    pan: '',
    entityType: '',
    location: '',
    relationshipManager: '',
    status: 'Under Process',
    roi: 0,
    delayROI: 0,
    sanctionAmount: 0,
    isActive: true
  });

  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      setFormData({
        ...formData,
        dealerCode: generateDealerCode(),
        loanProposalNo: generateLoanProposalNo(),
        name: currentUser?.name || '',
        dateOfOnboarding: formatISO(new Date()).split('T')[0]
      });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [open, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Prepare data for API
      const onboardingData = {
        ...formData,
        userId: currentUser?.id ? parseInt(currentUser.id) : 0,
        // Default values for other fields
        availableLimit: 0,
        outstandingAmount: 0,
        overdueCount: 0,
        documentStatus: 0,
        stockAuditStatus: 0,
        principalOutstanding: 0,
        pfReceived: 0,
        interestReceived: 0,
        delayInterestReceived: 0,
        amountReceived: 0,
        pfAcrued: 0,
        interestAccrued: 0,
        delayInterestAccrued: 0,
        registeredDate: new Date().toISOString(),
        waiverAmount: 0,
        utilizationPercentage: 0
      };

      // Submit to API
      await DealerService.createDealerOnboarding(onboardingData);
      
      setSuccessMessage('Dealer onboarding information submitted successfully!');
      
      // Call success callback after a delay to show success message
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting dealer onboarding:', error);
      setErrorMessage('Failed to submit dealer onboarding information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogTitle>
    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
      Dealer Onboarding
    </Typography>
  </DialogTitle>
  
  <DialogContent dividers>
    {errorMessage && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    )}
    
    {successMessage && (
      <Alert severity="success" sx={{ mb: 2 }}>
        {successMessage}
      </Alert>
    )}
    
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* Auto-generated Fields */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Dealer Code"
            name="dealerCode"
            value={formData.dealerCode}
            fullWidth
            disabled
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Loan Proposal No"
            name="loanProposalNo"
            value={formData.loanProposalNo}
            fullWidth
            disabled
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        
        {/* Date of Onboarding */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Date of Onboarding"
            name="dateOfOnboarding"
            type="date"
            value={formData.dateOfOnboarding}
            fullWidth
            disabled
            variant="outlined"
            margin="dense"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        {/* Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        
        {/* PAN */}
        <Grid item xs={12} md={6}>
          <TextField
            label="PAN"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        
        {/* Entity Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="entity-type-label">Entity Type</InputLabel>
            <Select
              labelId="entity-type-label"
              name="entityType"
              value={formData.entityType}
              onChange={handleSelectChange}
              label="Entity Type"
              required
            >
              {entityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Location */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={formData.location}
              onChange={handleSelectChange}
              label="Location"
              required
            >
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Relationship Manager */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Relationship Manager"
            name="relationshipManager"
            value={formData.relationshipManager}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        
        {/* Status */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            fullWidth
            disabled
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Grid>
        
        {/* ROI & Delay ROI */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Rate of Interest (%)"
            name="roi"
            type="number"
            value={formData.roi}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Delay Rate of Interest (%)"
            name="delayROI"
            type="number"
            value={formData.delayROI}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>
        
        {/* Sanction Amount */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Sanction Amount"
            name="sanctionAmount"
            type="number"
            value={formData.sanctionAmount}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
      </Grid>
    </Box>
  </DialogContent>
  
  <DialogActions sx={{ px: 3, py: 2 }}>
    <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
      Cancel
    </Button>
    <Button 
      onClick={handleSubmit} 
      variant="contained" 
      sx={{ bgcolor: '#1e3a8a' }}
      disabled={isSubmitting}
    >
      {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
    </Button>
  </DialogActions>
</Dialog>
  );
};

export default DealerOnboardingDialog;