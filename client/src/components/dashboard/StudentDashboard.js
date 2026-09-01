// client/src/components/dashboard/StudentDashboard.js
import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, LinearProgress, List, ListItem, ListItemText } from '@mui/material';
import { School, Assignment, Event, Grade } from '@mui/icons-material';
import WellnessSurveyForm from './WellnessSurveyForm';

const StudentDashboard = () => {
  const [studentStats] = useState({
    enrolledCourses: 5,
    completedAssignments: 12,
    upcomingEvents: 3,
    currentGPA: 3.67
  });

  const [courses] = useState([
    { name: 'Computer Science 101', progress: 75, nextClass: 'Tomorrow 10:00 AM' },
    { name: 'Mathematics', progress: 60, nextClass: 'Today 2:00 PM' },
    { name: 'Physics', progress: 85, nextClass: 'Friday 9:00 AM' }
  ]);

  const [upcomingEvents] = useState([
    { title: 'Midterm Exam - CS101', date: 'March 15', time: '10:00 AM' },
    { title: 'Assignment Due - Math', date: 'March 12', time: '11:59 PM' },
    { title: 'Project Presentation', date: 'March 18', time: '2:00 PM' }
  ]);

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
        Student Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Enrolled Courses" value={studentStats.enrolledCourses} icon={<School />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Completed Tasks" value={studentStats.completedAssignments} icon={<Assignment />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Upcoming Events" value={studentStats.upcomingEvents} icon={<Event />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Current GPA" value={studentStats.currentGPA} icon={<Grade />} />
        </Grid>

        {/* Course Progress */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Progress
            </Typography>
            <List>
              {courses.map((course, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={course.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Next class: {course.nextClass}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          <Typography variant="body2">{course.progress}%</Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <List dense>
              {upcomingEvents.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.date} at ${event.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Wellness Survey */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Wellness Check-in
            </Typography>
            <WellnessSurveyForm />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;