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
  CircularProgress
} from '@mui/material';

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
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Loan Management System
        </Typography>
        <Typography component="h2" variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
          Sign in to your account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="dense"
            required
            fullWidth
            id="email-address"
            label="Email Address"
            name="email"
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
            name="password"
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
              <RadioGroup 
                row 
                name="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <FormControlLabel 
                  value="dealer" 
                  control={<Radio size="small" />} 
                  label="Dealer" 
                />
                <FormControlLabel 
                  value="admin" 
                  control={<Radio size="small" />} 
                  label="Admin" 
                />
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
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Don't have an account? Register here
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
