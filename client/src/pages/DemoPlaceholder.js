// client/src/pages/DemoPlaceholder.js
import React from 'react';
import { Paper, Typography, Box, Alert } from '@mui/material';

const DemoPlaceholder = ({ title, message, detail }) => {
  return (
    <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography color="text.secondary">
          {message}
        </Typography>
      </Box>
      <Alert severity="info" sx={{ mt: 2 }}>
        {detail}
      </Alert>
    </Paper>
  );
};

export default DemoPlaceholder;