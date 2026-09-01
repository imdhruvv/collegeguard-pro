// client/src/components/dashboard/WellnessResults.js
import React, { useState } from 'react';
import { Box, Typography, LinearProgress, Grid } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const WellnessResults = () => {
  const [wellnessData] = useState({
    averageMood: 3.4,
    totalResponses: 247,
    moodDistribution: [
      { mood: 'Excellent', value: 45, color: '#4caf50' },
      { mood: 'Good', value: 102, color: '#8bc34a' },
      { mood: 'Average', value: 67, color: '#ffeb3b' },
      { mood: 'Poor', value: 23, color: '#ff9800' },
      { mood: 'Very Poor', value: 10, color: '#f44336' }
    ],
    weeklyTrend: [
      { day: 'Mon', mood: 3.2 },
      { day: 'Tue', mood: 3.5 },
      { day: 'Wed', mood: 3.1 },
      { day: 'Thu', mood: 3.6 },
      { day: 'Fri', mood: 3.8 },
      { day: 'Sat', mood: 4.0 },
      { day: 'Sun', mood: 3.7 }
    ]
  });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" color="primary">
              {wellnessData.averageMood}/5.0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Mood Rating
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on {wellnessData.totalResponses} responses
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(wellnessData.averageMood / 5) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Weekly Trend
          </Typography>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={wellnessData.weeklyTrend}>
              <XAxis dataKey="day" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="mood" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WellnessResults;