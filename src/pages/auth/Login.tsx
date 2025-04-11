import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Google, Facebook, GitHub, LinkedIn } from '@mui/icons-material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role: UserRole = 'admin'; // Hardcoded to admin
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP related state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpMethod, setOtpMethod] = useState('email');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerificationStep, setOtpVerificationStep] = useState(1); // 1 = choose method, 2 = enter OTP

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Instead of directly logging in, open the OTP dialog
      setIsLoading(false);
      openOtpDialog();
    } catch (err) {
      setError('Something went wrong');
      setIsLoading(false);
    }
  };

  const openOtpDialog = () => {
    setOtpDialogOpen(true);
    setOtpVerificationStep(1);
    setOtp('');
    setOtpMethod('email');
  };

  const handleSendOtp = () => {
    // Generate a random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    
    // Move to OTP entry step
    setOtpVerificationStep(2);
    
    // Show alert with the OTP (for demonstration)
    alert(`Your OTP is: ${randomOtp} (sent to your ${otpMethod})`);
  };

  const handleVerifyOtp = async () => {
    if (otp === generatedOtp) {
      setOtpDialogOpen(false);
      
      setIsLoading(true);
      try {
        await login(email, password, role);
        navigate(role === 'admin' ? '/admin/dashboard' : '/dealer/dashboard');
      } catch (err) {
        setError('Invalid login credentials');
        setIsLoading(false);
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ display: 'flex', borderRadius: '8px 90px', overflow: 'hidden', mt: 8 }}>
        {/* Left Section */}
        <Box
          sx={{
            width: '40%',
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            borderRadius: '0px 90px'
          }}
        >
          <Typography variant="h5" fontWeight="bold" align="center">
            Welcome Back!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Enter your details to sign in to your account.
          </Typography>
        </Box>

        {/* Right Section - Login Form */}
        <Box sx={{ width: '60%', p: 4 }}>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} /> : 'Sign in'}
            </Button>

            <Typography variant="body2" align="right">
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1e3a8a' }}>
                Forgot Password?
              </Link>
            </Typography>

            <Divider sx={{ my: 2 }}>OR</Divider>

            {/* <Grid container spacing={1} justifyContent="center">
              {[Google, Facebook, GitHub, LinkedIn].map((Icon, index) => (
                <Grid item key={index}>
                  <Button variant="outlined" sx={{ minWidth: 50, p: 1 }}>
                    <Icon />
                  </Button>
                </Grid>
              ))}
            </Grid> */}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Register here
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onClose={handleCloseOtpDialog}>
        <DialogTitle>OTP Verification</DialogTitle>
        <DialogContent>
          {otpVerificationStep === 1 && (
            <>
              <Typography variant="body1" gutterBottom>
                Please select how you want to receive the OTP:
              </Typography>
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <RadioGroup 
                  row 
                  value={otpMethod} 
                  onChange={(e) => setOtpMethod(e.target.value)}
                >
                  <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                </RadioGroup>
              </FormControl>
            </>
          )}
          
          {otpVerificationStep === 2 && (
            <>
              <Typography variant="body1" gutterBottom>
                Enter the OTP sent to your {otpMethod}:
              </Typography>
              <TextField
                margin="dense"
                required
                fullWidth
                id="otp"
                label="OTP"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog}>Cancel</Button>
          {otpVerificationStep === 1 && (
            <Button onClick={handleSendOtp}>Send OTP</Button>
          )}
          {otpVerificationStep === 2 && (
            <Button onClick={handleVerifyOtp}>Verify</Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;