// client/src/pages/RegisterPage.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register as apiRegister } from '../api/authApi';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await apiRegister(name, email, password);
      login(userData);
      navigate('/dashboard');
    } catch (err) { 
      setError('Failed to create account. User may already exist.'); 
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Create Account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Join CollegeGuard today
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            id="name" 
            label="Full Name" 
            name="name" 
            autoComplete="name" 
            autoFocus 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            id="email" 
            label="Email Address" 
            name="email" 
            autoComplete="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            name="password" 
            label="Password" 
            type="password" 
            id="password" 
            autoComplete="new-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary" sx={{ textAlign: 'center' }}>
              Already have an account? Sign In
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;