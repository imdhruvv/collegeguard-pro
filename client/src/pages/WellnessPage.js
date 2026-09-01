import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import WellnessSurveyForm from '../components/dashboard/WellnessSurveyForm';

const WellnessPage = () => {
  return (
    <Box sx={{ p: 3 }} aria-label="wellness page">
      <Typography variant="h5" gutterBottom>
        Wellness Survey
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        <WellnessSurveyForm />
      </Paper>
    </Box>
  );
};

export default WellnessPage;