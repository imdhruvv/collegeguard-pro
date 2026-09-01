import React from 'react';
import { Box, Typography } from '@mui/material';
import QRAttendance from '../components/attendance/QRAttendance';

const QRAttendancePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        QR Code Attendance System
      </Typography>
      <QRAttendance />
    </Box>
  );
};

export default QRAttendancePage;