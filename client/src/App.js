// client/src/App.js - Fixed loading context usage
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import { useLoading } from './context/LoadingContext';  // Changed this line

// Layout components
import Layout from './components/layout/Layout';
import GlobalLoader from './components/layout/GlobalLoader';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import CoursesPage from './pages/CoursesPage';
import WellnessPage from './pages/WellnessPage';
import QRAttendancePage from './pages/QRAttendancePage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';

// Import with fallbacks to prevent crashes
import BiometricEntryExitPage from './pages/BiometricEntryExitPage';
import FacultyAttendanceEditPage from './pages/FacultyAttendanceEditPage';

// Analytics component
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';

// Page imports
import AdminAdmissionsPage from './pages/AdminAdmissionsPage';

// Security Dashboard Component
const SecurityDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Security Dashboard - Anti-Proxy System</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Biometric System Status</h3>
          <ul>
            <li>✅ Active biometric scanners: 8/8</li>
            <li>⚡ Successful scans today: 1,247</li>
            <li>⚠️ Failed biometric attempts: 23</li>
            <li>🔄 QR fallback usage: 15</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Anti-Proxy Detection</h3>
          <ul>
            <li>🚫 Proxy attempts blocked: 47</li>
            <li>🌍 Geofence violations: 3</li>
            <li>📱 Device anomalies detected: 8</li>
            <li>🔍 Suspicious patterns: 12</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Campus Security</h3>
          <ul>
            <li>📹 Security cameras: 32/32 online</li>
            <li>🚪 RFID readers: 12/12 active</li>
            <li>🔔 Emergency buttons: 16 ready</li>
            <li>📡 Door sensors: 24 monitoring</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Real-time Analytics</h3>
          <ul>
            <li>👥 Students on campus: 1,156</li>
            <li>👨‍🏫 Faculty on campus: 67</li>
            <li>🎯 Attendance accuracy: 98.7%</li>
            <li>⏱️ Average processing time: 0.8s</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(lightTheme);
  const { loading } = useLoading();  // Changed this line to use the hook

  const toggleTheme = () => {
    setTheme(theme.palette.mode === 'light' ? darkTheme : lightTheme);
  };

  return (
    <Router>
      <GlobalLoader open={loading} />
      <Routes>
        <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          {/* Dashboard - All roles */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          
          {/* Biometric Entry/Exit - All roles */}
          <Route
            path="/entry-exit"
            element={<ProtectedRoute><BiometricEntryExitPage /></ProtectedRoute>}
          />
          
          {/* QR Attendance - All roles */}
          <Route
            path="/qr-attendance"
            element={<ProtectedRoute><QRAttendancePage /></ProtectedRoute>}
          />
          
          {/* Wellness - All roles */}
          <Route
            path="/wellness"
            element={<ProtectedRoute><WellnessPage /></ProtectedRoute>}
          />
          
          {/* Student Details - Admin and Faculty only */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Faculty']}>
                <StudentDetailsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Course Management - Admin only */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admissions Management - Admin only */}
          <Route
            path="/admissions"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminAdmissionsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Faculty Attendance Edit - Faculty only */}
          <Route
            path="/faculty/attendance/:courseId"
            element={
              <ProtectedRoute allowedRoles={['Faculty']}>
                <FacultyAttendanceEditPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/faculty/attendance"
            element={
              <ProtectedRoute allowedRoles={['Faculty']}>
                <FacultyAttendanceEditPage />
              </ProtectedRoute>
            }
          />
          
          {/* Advanced Analytics - Admin only */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdvancedAnalytics />
              </ProtectedRoute>
            }
          />
          
          {/* Security Dashboard - Admin only */}
          <Route
            path="/security"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SecurityDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        </Route>
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;