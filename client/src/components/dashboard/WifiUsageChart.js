import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getResourceUsage } from '../../api/resourceApi';
import { Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WifiUsageChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResourceUsage('wifi');
        setError('');
        if (data && data.length > 0) {
          setChartData({
            labels: data.map(d => new Date(d.createdAt).toLocaleTimeString()),
            datasets: [{
              label: 'Wi-Fi Usage (GB)',
              data: data.map(d => d.usageValue),
              borderColor: '#00bcd4', // Use theme color
              backgroundColor: 'rgba(0, 188, 212, 0.2)',
              fill: true,
              tension: 0.4
            }]
          });
        }
      } catch (error) {
        console.error("Failed to fetch Wi-Fi data", error);
        setError('Failed to load Wi-Fi data.');
      }
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Live Wi-Fi Usage</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {!error && (chartData ? <Line data={chartData} /> : <Typography variant="body2">No Wi-Fi data available to display.</Typography>)}
    </Paper>
  );
};

export default WifiUsageChart;