// client/src/components/dashboard/AdminDashboard.js
import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { People, School, Security, TrendingUp } from '@mui/icons-material';
import LiveResourceChart from './LiveResourceChart';
import SecurityFeed from './SecurityFeed';
import UserList from './UserList';
import WellnessResults from './WellnessResults';

const AdminDashboard = () => {
  const [stats] = useState({
    totalStudents: 1247,
    totalFaculty: 89,
    activeCourses: 45,
    securityAlerts: 3
  });

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Faculty Members"
            value={stats.totalFaculty}
            icon={<School />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Courses"
            value={stats.activeCourses}
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Security Alerts"
            value={stats.securityAlerts}
            icon={<Security />}
            color="warning"
          />
        </Grid>

        {/* Resource Usage Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Real-time Resource Usage
            </Typography>
            <LiveResourceChart />
          </Paper>
        </Grid>

        {/* Security Feed */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Security Events
            </Typography>
            <SecurityFeed />
          </Paper>
        </Grid>

        {/* Wellness Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Student Wellness Overview
            </Typography>
            <WellnessResults />
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Recent User Activity
            </Typography>
            <UserList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;