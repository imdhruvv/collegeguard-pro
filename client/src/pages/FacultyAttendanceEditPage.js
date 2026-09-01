// client/src/pages/FacultyAttendanceEditPage.js
import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import FacultyAttendanceEdit from '../components/attendance/FacultyAttendanceEdit';

const FacultyAttendanceEditPage = () => {
  const { courseId } = useParams();
  
  return (
    <Box>
      <FacultyAttendanceEdit courseId={courseId} />
    </Box>
  );
};

export default FacultyAttendanceEditPage;