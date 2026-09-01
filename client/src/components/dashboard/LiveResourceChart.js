// client/src/components/dashboard/LiveResourceChart.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const LiveResourceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initialize with some sample data
    const initialData = [];
    for (let i = 0; i < 20; i++) {
      initialData.push({
        time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
        electricity: Math.floor(Math.random() * 100) + 200,
        water: Math.floor(Math.random() * 50) + 100,
        wifi: Math.floor(Math.random() * 500) + 1000
      });
    }
    setData(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString(),
          electricity: Math.floor(Math.random() * 100) + 200,
          water: Math.floor(Math.random() * 50) + 100,
          wifi: Math.floor(Math.random() * 500) + 1000
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="electricity" stroke="#8884d8" name="Electricity (kWh)" />
          <Line type="monotone" dataKey="water" stroke="#82ca9d" name="Water (L)" />
          <Line type="monotone" dataKey="wifi" stroke="#ffc658" name="WiFi (MB)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LiveResourceChart;
