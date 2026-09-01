// client/src/pages/AdminAdmissionsPage.js
import React from 'react';
import { Box } from '@mui/material';
import NewAdmissionSystem from '../components/admin/NewAdmissionSystem';

const AdminAdmissionsPage = () => {
  return (
    <Box sx={{ p: 2 }}>
      <NewAdmissionSystem />
    </Box>
  );
};

export default AdminAdmissionsPage;