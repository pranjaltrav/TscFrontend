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
  Grid
} from '@mui/material';
import { Google, Facebook, GitHub, LinkedIn } from '@mui/icons-material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('dealer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      await login(email, password, role);
      navigate(role === 'admin' ? '/admin/dashboard' : '/dealer/dashboard');
    } catch (err) {
      setError('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
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

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, justifyContent: 'space-between' }}>
              <Typography component="label" variant="body2">
                I am a:
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <FormControlLabel value="dealer" control={<Radio size="small" />} label="Dealer" />
                  <FormControlLabel value="admin" control={<Radio size="small" />} label="Admin" />
                </RadioGroup>
              </FormControl>
            </Box>

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

            {/* Social Login Buttons */}
            <Grid container spacing={1} justifyContent="center">
              {[Google, Facebook, GitHub, LinkedIn].map((Icon, index) => (
                <Grid item key={index}>
                  <Button variant="outlined" sx={{ minWidth: 50, p: 1 }}>
                    <Icon />
                  </Button>
                </Grid>
              ))}
            </Grid>

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
    </Container>
  );
};

export default Login;
