// client/src/components/layout/GlobalLoader.js
import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const GlobalLoader = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={60} />
      <Box textAlign="center">
        <Typography variant="h6">Loading...</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Please wait while we process your request
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoader;