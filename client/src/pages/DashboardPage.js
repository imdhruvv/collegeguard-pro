import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import FacultyDashboard from '../components/dashboard/FacultyDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  const renderDashboardByRole = () => {
    if (!user) return <progress />;
    switch (user.role) {
      case 'Admin': return <AdminDashboard />;
      case 'Faculty': return <FacultyDashboard />;
      case 'Student': return <StudentDashboard />;
      default: return <h2>Unknown role</h2>;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {renderDashboardByRole()}
    </Box>
  );
};
export default DashboardPage;
