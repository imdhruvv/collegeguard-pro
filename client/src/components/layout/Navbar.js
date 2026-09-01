import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary" elevation={2} role="navigation" aria-label="main navigation">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/dashboard"
              sx={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 'bold',
                mr: 3,
                '&:hover': { textDecoration: 'underline' }
              }}
              aria-label="CollegeGuard home"
            >
              CollegeGuard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography aria-label="user information" sx={{ color: '#fff' }}>
              Welcome, {user?.name || 'Faculty Member'} ({user?.role || 'Faculty'})
            </Typography>
            <Button
              aria-label="logout"
              variant="contained"
              color="secondary"
              onClick={logout}
              sx={{ ml: 2, fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
