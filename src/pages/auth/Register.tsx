import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Box, Container, Alert, CircularProgress, Paper } from '@mui/material';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('dealer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await register(name, email, password, role);
      navigate(role === 'admin' ? '/admin/dashboard' : '/dealer/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 2 }}>
        <Typography variant="h5" align="center" fontWeight="bold">
          Loan Management System
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Create your account
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField 
            fullWidth 
            size="small" 
            label="Full Name" 
            margin="normal" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            fullWidth 
            size="small" 
            label="Email Address" 
            type="email" 
            margin="normal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            fullWidth 
            size="small" 
            label="Password" 
            type="password" 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <TextField 
            fullWidth 
            size="small" 
            label="Confirm Password" 
            type="password" 
            margin="normal" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Register as:</FormLabel>
            <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <FormControlLabel value="dealer" control={<Radio />} label="Dealer" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </FormControl>
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          
          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;