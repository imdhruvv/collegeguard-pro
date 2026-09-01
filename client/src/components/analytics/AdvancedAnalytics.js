// client/src/components/analytics/AdvancedAnalytics.js
import React, { useState } from 'react';
import { 
  Grid, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, LinearProgress 
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for different analytics
  const attendanceTrends = [
    { date: 'Mon', rate: 85 }, { date: 'Tue', rate: 92 }, { date: 'Wed', rate: 78 },
    { date: 'Thu', rate: 88 }, { date: 'Fri', rate: 95 }, { date: 'Sat', rate: 45 }, { date: 'Sun', rate: 12 }
  ];

  const wellnessDistribution = [
    { mood: 'Excellent', value: 25, color: '#4caf50' },
    { mood: 'Good', value: 45, color: '#8bc34a' },
    { mood: 'Average', value: 20, color: '#ffeb3b' },
    { mood: 'Poor', value: 10, color: '#ff9800' }
  ];

  const resourceEfficiency = [
    { resource: 'WiFi', efficiency: 92, target: 90 },
    { resource: 'Electricity', efficiency: 78, target: 85 },
    { resource: 'Water', efficiency: 85, target: 80 }
  ];

  const securityIncidents = [
    { type: 'Motion Alert', count: 45 },
    { type: 'Access Denied', count: 12 },
    { type: 'Fire Alarm', count: 3 },
    { type: 'Emergency', count: 1 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Advanced Analytics</Typography>
        <FormControl size="small">
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 3 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Attendance Trends */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Attendance Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                <Area type="monotone" dataKey="rate" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Wellness Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Student Wellness</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wellnessDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ mood, value }) => `${mood}: ${value}%`}
                >
                  {wellnessDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Resource Efficiency */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Resource Efficiency</Typography>
            {resourceEfficiency.map((item) => (
              <Box key={item.resource} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.resource}</Typography>
                  <Typography variant="body2" color={item.efficiency >= item.target ? 'success.main' : 'warning.main'}>
                    {item.efficiency}% (Target: {item.target}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.efficiency} 
                  color={item.efficiency >= item.target ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Security Incidents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Security Incidents</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={securityIncidents} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Key Metrics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { title: 'Active Students', value: '1,247', change: '+5.2%', color: 'primary' },
              { title: 'Average Attendance', value: '87.3%', change: '+2.1%', color: 'success' },
              { title: 'Wellness Score', value: '4.2/5', change: '+0.3', color: 'info' },
              { title: 'Security Alerts', value: '3', change: '-2', color: 'warning' }
            ].map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color={`${metric.color}.main`}>
                      {metric.change} from last period
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedAnalytics;