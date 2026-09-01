import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { useNotifier } from '../components/layout/Notifier';

const FacultyAttendancePage = () => {
  const notify = useNotifier();

  const handleDemoMarkAttendance = () => {
    // Simulate marking attendance
    notify('Attendance marked! (demo)', 'success');
  };

  return (
    <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Faculty Attendance</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography color="text.secondary">
          Unable to fetch attendance data.<br />
          <b>Database connection pending or not configured.</b>
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleDemoMarkAttendance}>
        Mark Attendance (Demo)
      </Button>
      <Typography variant="body2" color="text.disabled" sx={{ mt: 2 }}>
        (This is a demo page. Attendance features will be available once the database is connected.)
      </Typography>
    </Paper>
  );
};

export default FacultyAttendancePage;