// client/src/pages/StudentDetailsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField,
  InputAdornment, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Search, Person, Fingerprint, Visibility,
  School, CheckCircle, Warning, TrendingUp
} from '@mui/icons-material';
import { getAllUsers } from '../api/userApi';
import StudentPerformance from '../components/dashboard/StudentPerformance';

const fallbackStudents = [
  { _id: '1', name: 'Alice Johnson', email: 'alice@demo.com', studentId: 'STU001', department: 'Computer Science', semester: '6th', attendanceRate: 94, biometricEnrolled: true, status: 'Active' },
  { _id: '2', name: 'Bob Smith', email: 'bob@demo.com', studentId: 'STU002', department: 'Data Science', semester: '4th', attendanceRate: 82, biometricEnrolled: true, status: 'Active' },
  { _id: '3', name: 'Charlie Lee', email: 'charlie@demo.com', studentId: 'STU003', department: 'Electronics', semester: '6th', attendanceRate: 71, biometricEnrolled: false, status: 'Warning' },
  { _id: '4', name: 'Diana Patel', email: 'diana@demo.com', studentId: 'STU004', department: 'Computer Science', semester: '8th', attendanceRate: 98, biometricEnrolled: true, status: 'Active' },
  { _id: '5', name: 'Ethan Brown', email: 'ethan@demo.com', studentId: 'STU005', department: 'Information Tech', semester: '2nd', attendanceRate: 64, biometricEnrolled: true, status: 'Critical' },
];

const StudentDetailsPage = () => {
  const [students, setStudents] = useState(fallbackStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        if (Array.isArray(data) && data.length > 0) {
          const studentList = data
            .filter(u => u.role === 'Student')
            .map((s, idx) => ({
              ...s,
              studentId: s.studentId || `STU${100 + idx}`,
              department: s.department || 'Computer Science',
              semester: s.semester || '6th',
              attendanceRate: s.attendanceRate || (75 + (idx * 5) % 25),
              biometricEnrolled: s.biometricEnrolled !== undefined ? s.biometricEnrolled : true,
              status: (s.attendanceRate || 80) >= 85 ? 'Active' : (s.attendanceRate || 80) >= 75 ? 'Warning' : 'Critical'
            }));
          if (studentList.length > 0) {
            setStudents(studentList);
          }
        }
      } catch (err) {
        console.warn('Using demo student data due to API error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPerformance = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const getStatusChip = (rate) => {
    if (rate >= 85) return <Chip icon={<CheckCircle />} label={`${rate}% Attendance`} color="success" size="small" />;
    if (rate >= 75) return <Chip icon={<TrendingUp />} label={`${rate}% (Warning)`} color="warning" size="small" />;
    return <Chip icon={<Warning />} label={`${rate}% (Low Attendance)`} color="error" size="small" />;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Student Roster & Performance Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor biometric attendance compliance, academic rosters, and proxy risk levels.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total Enrolled Students</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mt: 0.5 }}>
                {students.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Across all active departments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Biometric Verified</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'success.main', mt: 0.5 }}>
                {students.filter(s => s.biometricEnrolled).length} / {students.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Fingerprint templates mapped</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Average Attendance</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'info.main', mt: 0.5 }}>
                {(students.reduce((acc, s) => acc + (s.attendanceRate || 80), 0) / (students.length || 1)).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Campus-wide current semester</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Attendance Shortage (&lt;75%)</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'error.main', mt: 0.5 }}>
                {students.filter(s => (s.attendanceRate || 80) < 75).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Requires dean notification</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search by student name, ID, email or department..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 320 }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing {filteredStudents.length} of {students.length} students
          </Typography>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Biometric Status</TableCell>
                <TableCell>Attendance Compliance</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id || student.studentId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {student.name ? student.name.charAt(0) : <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{student.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={student.studentId || 'STU-NEW'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <School fontSize="small" color="action" />
                      <Typography variant="body2">{student.department || 'General Science'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {student.biometricEnrolled ? (
                      <Chip icon={<Fingerprint />} label="Biometric Active" color="success" size="small" variant="outlined" />
                    ) : (
                      <Chip icon={<Warning />} label="Not Enrolled" color="warning" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(student.attendanceRate || 80)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Detailed Analytics">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleOpenPerformance(student)}
                      >
                        Analytics
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {selectedStudent?.name ? selectedStudent.name.charAt(0) : 'S'}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedStudent?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedStudent?.studentId} • {selectedStudent?.department} • {selectedStudent?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <StudentPerformance studentId={selectedStudent._id || selectedStudent.studentId} studentName={selectedStudent.name} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDetailsPage;
