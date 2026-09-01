import React from 'react';
import { Typography, Box } from '@mui/material';

const NotAuthorizedPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4" color="error" gutterBottom>
      403 – Not Authorized
    </Typography>
    <Typography variant="body1">
      You do not have permission to view this page.
    </Typography>
  </Box>
);

export default NotAuthorizedPage;