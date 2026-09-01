import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotifier } from '../components/layout/Notifier';
import { 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert
} from '@mui/material';
import {
  Login,
  Logout,
  AccessTime,
  Person,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { apiClient } from '../config/api';

const EntryExitPage = () => {
  const { user } = useContext(AuthContext);
  const notify = useNotifier();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  // Fetch today's attendance records
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await apiClient.get('/api/attendance/today');
      setTodayAttendance(response.data);
      
      // Check if current user has an active entry
      const userEntry = response.data.find(
        record => record.user && record.user._id === user?._id && !record.exitTime
      );
      setCurrentStatus(userEntry ? 'checked-in' : 'checked-out');
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      // Don't show error for demo purposes
    }
  };

  const handleEntry = async () => {
    if (!user) {
      notify('Please login first', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/attendance/entry', { userId: user._id });
      setCurrentStatus('checked-in');
      setLastAction('entry');
      notify('Entry logged successfully!', 'success');
      fetchTodayAttendance(); // Refresh the list
    } catch (error) {
      console.error('Entry failed:', error);
      notify('Failed to log entry. Server may be offline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async () => {
    if (!user) {
      notify('Please login first', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/attendance/exit', { userId: user._id });
      setCurrentStatus('checked-out');
      setLastAction('exit');
      notify('Exit logged successfully!', 'success');
      fetchTodayAttendance(); // Refresh the list
    } catch (error) {
      console.error('Exit failed:', error);
      if (error.response?.status === 404) {
        notify('No active entry found. Please check in first.', 'warning');
      } else {
        notify('Failed to log exit. Server may be offline.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    return status === 'checked-in' ? 'success' : 'default';
  };

  const getStatusIcon = (hasExit) => {
    return hasExit ? <Logout color="action" /> : <Login color="success" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Smart Entry/Exit System
      </Typography>
      
      <Grid container spacing={3}>
        {/* Main Action Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Campus Access Control
              </Typography>
              
              {/* Current Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status
                </Typography>
                <Chip
                  icon={currentStatus === 'checked-in' ? <CheckCircle /> : <Schedule />}
                  label={currentStatus === 'checked-in' ? 'Checked In' : 'Checked Out'}
                  color={getStatusColor(currentStatus)}
                  size="large"
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Login />}
                  onClick={handleEntry}
                  disabled={loading || currentStatus === 'checked-in'}
                  sx={{ minWidth: 140 }}
                >
                  {loading && lastAction === 'entry' ? 'Checking In...' : 'Check In'}
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<Logout />}
                  onClick={handleExit}
                  disabled={loading || currentStatus === 'checked-out'}
                  sx={{ minWidth: 140 }}
                >
                  {loading && lastAction === 'exit' ? 'Checking Out...' : 'Check Out'}
                </Button>
              </Box>

              {/* User Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Person color="action" />
                <Typography variant="body2" color="text.secondary">
                  {user?.name || 'Unknown User'} ({user?.role || 'No Role'})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Activity */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime />
                Today's Campus Activity
              </Typography>
              
              {todayAttendance.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No attendance records for today. Be the first to check in!
                </Alert>
              ) : (
                <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {todayAttendance.slice(0, 10).map((record, index) => (
                    <React.Fragment key={record._id || index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(record.exitTime)}
                        </ListItemIcon>
                        <ListItemText
                          primary={record.user?.name || 'Unknown User'}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                Entry: {formatTime(record.entryTime)}
                              </Typography>
                              {record.exitTime && (
                                <Typography variant="caption" display="block">
                                  Exit: {formatTime(record.exitTime)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          size="small"
                          label={record.exitTime ? 'Completed' : 'Active'}
                          color={record.exitTime ? 'default' : 'success'}
                          variant="outlined"
                        />
                      </ListItem>
                      {index < Math.min(todayAttendance.length - 1, 9) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions/Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              How to Use the Entry/Exit System
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Login sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Step 1: Check In
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click "Check In" when you arrive on campus to log your entry time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <AccessTime sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Step 2: Campus Activities
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your presence is tracked for attendance and security purposes.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Logout sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Step 3: Check Out
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click "Check Out" when leaving campus to complete your session.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntryExitPage;