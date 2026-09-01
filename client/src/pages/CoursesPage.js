import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'Course ID', width: 150 },
  { field: 'name', headerName: 'Course Name', width: 200 },
  { field: 'instructor', headerName: 'Instructor', width: 200 },
  { field: 'credits', headerName: 'Credits', width: 100 },
];

const fakeCourses = [
  { id: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 3 },
  { id: 'MATH201', name: 'Calculus I', instructor: 'Prof. Jones', credits: 4 },
  { id: 'ENG301', name: 'Literature Survey', instructor: 'Dr. Brown', credits: 3 },
  { id: 'PHYS101', name: 'Physics Fundamentals', instructor: 'Prof. Lee', credits: 4 },
];

const CoursesPage = () => {
  return (
    <Box sx={{ p: 3 }} aria-label="courses page">
      <Typography variant="h5" gutterBottom>
        Course Management
      </Typography>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={fakeCourses}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          aria-label="course list table"
        />
      </Paper>
    </Box>
  );
};

export default CoursesPage;