// client/src/components/layout/Layout.js - Updated with all new routes
import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import EmergencyButton from '../emergency/EmergencyButton';
import useSocket from '../../hooks/useSocket';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SchoolIcon from '@mui/icons-material/School';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ThemeToggle from './ThemeToggle';

const drawerWidth = 240;

const navItemsByRole = {
  Admin: [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Biometric Entry/Exit', icon: <FingerprintIcon />, path: '/entry-exit' },
    { text: 'New Admissions', icon: <PersonAddIcon />, path: '/admissions' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'QR Attendance', icon: <QrCodeIcon />, path: '/qr-attendance' },
    { text: 'Wellness', icon: <HealthAndSafetyIcon />, path: '/wellness' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Security', icon: <SecurityIcon />, path: '/security' },
  ],
  Faculty: [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Biometric Entry/Exit', icon: <FingerprintIcon />, path: '/entry-exit' },
    { text: 'Edit Attendance', icon: <EditIcon />, path: '/faculty/attendance' },
    { text: 'QR Attendance', icon: <QrCodeIcon />, path: '/qr-attendance' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Wellness', icon: <HealthAndSafetyIcon />, path: '/wellness' },
  ],
  Student: [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Biometric Entry/Exit', icon: <FingerprintIcon />, path: '/entry-exit' },
    { text: 'QR Attendance', icon: <QrCodeIcon />, path: '/qr-attendance' },
    { text: 'Wellness', icon: <HealthAndSafetyIcon />, path: '/wellness' },
  ],
};

const Layout = ({ children, theme, toggleTheme }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navItems = navItemsByRole[user?.role] || [];

  // Initialize socket connection for real-time updates
  useSocket();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link 
              to="/dashboard" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              CollegeGuard Pro - Anti-Proxy System
            </Link>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              {user?.name || 'User'} ({user?.role || 'Role'})
            </Typography>
            
            {/* Theme Toggle Button */}
            {theme && toggleTheme && (
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            )}
            
            <Button 
              color="inherit" 
              onClick={handleLogout}
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box' 
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: 'medium'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>

      {/* Emergency Button - Available to all users */}
      <EmergencyButton />
    </Box>
  );
};

export default Layout;