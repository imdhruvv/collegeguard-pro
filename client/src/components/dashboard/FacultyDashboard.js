// client/src/components/dashboard/FacultyDashboard.js
import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Class, Assignment, People, Schedule } from '@mui/icons-material';
import { useNotifier } from '../layout/Notifier';

const FacultyDashboard = () => {
  const notify = useNotifier();
  const [courses] = useState([
    { id: 1, name: 'Computer Science 101', students: 45, nextClass: '10:00 AM', room: 'Room 204' },
    { id: 2, name: 'Data Structures', students: 38, nextClass: '2:00 PM', room: 'Room 301' },
    { id: 3, name: 'Algorithm Design', students: 32, nextClass: '4:00 PM', room: 'Room 205' }
  ]);

  const [upcomingTasks] = useState([
    { task: 'Grade midterm exams', deadline: 'Tomorrow', priority: 'high' },
    { task: 'Prepare lecture slides', deadline: 'Today', priority: 'medium' },
    { task: 'Student meeting', deadline: '2 hours', priority: 'low' }
  ]);

  const handleMarkAttendance = (courseId) => {
    notify(`Attendance marked for course ${courseId}`, 'success');
  };

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
        Faculty Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="My Courses" value={courses.length} icon={<Class />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value="115" icon={<People />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Tasks" value={upcomingTasks.length} icon={<Assignment />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Classes Today" value="3" icon={<Schedule />} />
        </Grid>

        {/* Course List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Courses
            </Typography>
            <List>
              {courses.map((course) => (
                <ListItem key={course.id} divider>
                  <ListItemText
                    primary={course.name}
                    secondary={`${course.students} students • Next: ${course.nextClass} • ${course.room}`}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMarkAttendance(course.id)}
                  >
                    Mark Attendance
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            <List dense>
              {upcomingTasks.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={task.task}
                    secondary={`Due: ${task.deadline}`}
                  />
                  <Chip
                    label={task.priority}
                    color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacultyDashboard;