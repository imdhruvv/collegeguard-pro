// client/src/components/attendance/FacultyAttendanceEdit.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableHead, TableBody, 
  TableRow, TableCell, Button, Alert, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Grid, LinearProgress, Divider
} from '@mui/material';
import { 
  Save, Edit, Lock, Schedule, Person
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNotifier } from '../layout/Notifier';

const FacultyAttendanceEdit = ({ courseId }) => {
  const { user } = useContext(AuthContext);
  const notify = useNotifier();
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editedRecords, setEditedRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, data: null });
  const [canEdit, setCanEdit] = useState(true);

  const loadCourses = useCallback(async () => {
    try {
      // For demo, using mock data. In real app, fetch faculty's courses
      const mockCourses = [
        { _id: 'cs101', name: 'Computer Science 101', courseCode: 'CS101' },
        { _id: 'cs201', name: 'Data Structures', courseCode: 'CS201' },
        { _id: 'math101', name: 'Mathematics', courseCode: 'MATH101' }
      ];
      setCourses(mockCourses);
      if (!selectedCourse && mockCourses.length > 0) {
        setSelectedCourse(mockCourses[0]._id);
      }
    } catch (error) {
      notify('Failed to load courses', 'error');
    }
  }, [selectedCourse, notify]);

  const loadAttendanceData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock attendance data for demo
      const mockAttendance = [
        { 
          _id: '1', 
          student: { _id: 's1', name: 'Alice Johnson', email: 'alice@demo.com' },
          present: true,
          status: 'Present',
          markedAt: new Date(selectedDate + 'T09:00:00'),
          biometricVerified: true,
          method: 'biometric'
        },
        { 
          _id: '2', 
          student: { _id: 's2', name: 'Bob Smith', email: 'bob@demo.com' },
          present: false,
          status: 'Absent',
          markedAt: null,
          biometricVerified: false,
          method: null
        },
        { 
          _id: '3', 
          student: { _id: 's3', name: 'Charlie Lee', email: 'charlie@demo.com' },
          present: true,
          status: 'Present',
          markedAt: new Date(selectedDate + 'T09:15:00'),
          biometricVerified: false,
          method: 'qr_fallback'
        },
        { 
          _id: '4', 
          student: { _id: 's4', name: 'Diana Patel', email: 'diana@demo.com' },
          present: true,
          status: 'Present',
          markedAt: new Date(selectedDate + 'T08:45:00'),
          biometricVerified: true,
          method: 'biometric'
        },
        { 
          _id: '5', 
          student: { _id: 's5', name: 'Ethan Brown', email: 'ethan@demo.com' },
          present: false,
          status: 'Absent',
          markedAt: null,
          biometricVerified: false,
          method: null
        }
      ];
      
      setAttendanceData(mockAttendance);
    } catch (error) {
      notify('Failed to load attendance data', 'error');
    }
    setLoading(false);
  }, [selectedDate, notify]);

  const checkEditPermission = useCallback(() => {
    const dateCreated = new Date(selectedDate);
    const now = new Date();
    const timeDiff = now - dateCreated;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    setCanEdit(hoursDiff < 48);
  }, [selectedDate]);

  // Load courses and attendance data
  useEffect(() => {
    loadCourses();
    if (selectedCourse && selectedDate) {
      loadAttendanceData();
      checkEditPermission();
    }
  }, [selectedCourse, selectedDate, loadCourses, loadAttendanceData, checkEditPermission]);

  // Timer for 48-hour edit window
  useEffect(() => {
    if (selectedDate) {
      const interval = setInterval(() => {
        const dateCreated = new Date(selectedDate);
        const now = new Date();
        const timeDiff = 48 * 60 * 60 * 1000 - (now - dateCreated); // 48 hours in ms
        
        if (timeDiff > 0) {
          setTimeRemaining(timeDiff);
          setCanEdit(true);
        } else {
          setTimeRemaining(0);
          setCanEdit(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedDate]);

  const handleAttendanceChange = (recordId, newStatus) => {
    if (!canEdit) {
      notify('Edit window has expired (48 hours)', 'error');
      return;
    }

    setEditedRecords(prev => ({
      ...prev,
      [recordId]: {
        ...attendanceData.find(r => r._id === recordId),
        present: newStatus === 'Present',
        status: newStatus,
        editedAt: new Date(),
        editedBy: user._id
      }
    }));
  };

  const saveChanges = async () => {
    if (Object.keys(editedRecords).length === 0) {
      notify('No changes to save', 'info');
      return;
    }

    setConfirmDialog({
      open: true,
      data: {
        recordCount: Object.keys(editedRecords).length,
        course: courses.find(c => c._id === selectedCourse)?.name,
        date: selectedDate
      }
    });
  };

  const confirmSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setAttendanceData(prev => 
        prev.map(record => 
          editedRecords[record._id] ? editedRecords[record._id] : record
        )
      );
      
      setEditedRecords({});
      notify(`Successfully updated ${Object.keys(editedRecords).length} attendance records`, 'success');
      
    } catch (error) {
      notify('Failed to save changes', 'error');
    }
    
    setConfirmDialog({ open: false, data: null });
    setLoading(false);
  };

  const cancelChanges = () => {
    setEditedRecords({});
    notify('Changes cancelled', 'info');
  };

  const formatTimeRemaining = (ms) => {
    if (!ms || ms <= 0) return 'Edit window expired';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getMethodChip = (method, biometricVerified) => {
    if (method === 'biometric' && biometricVerified) {
      return <Chip label="Biometric" color="success" size="small" />;
    } else if (method === 'qr_fallback') {
      return <Chip label="QR Fallback" color="warning" size="small" />;
    } else if (method === 'biometric' && !biometricVerified) {
      return <Chip label="Bio Failed" color="error" size="small" />;
    }
    return <Chip label="Not Marked" color="default" size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Faculty Attendance Edit System
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={loading}
                >
                  {courses.map(course => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.courseCode} - {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Edit Window Status
                </Typography>
                <Chip 
                  icon={canEdit ? <Schedule /> : <Lock />}
                  label={formatTimeRemaining(timeRemaining)}
                  color={canEdit ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Window Alert */}
      <Alert 
        severity={canEdit ? 'info' : 'warning'} 
        sx={{ mb: 3 }}
        icon={canEdit ? <Schedule /> : <Lock />}
      >
        {canEdit 
          ? `You can edit attendance for this date. ${formatTimeRemaining(timeRemaining)} to make changes.`
          : 'The 48-hour edit window has expired. Attendance records are now locked.'
        }
      </Alert>

      {/* Attendance Table */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Attendance Records - {selectedDate}
            </Typography>
            
            {Object.keys(editedRecords).length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveChanges}
                  disabled={!canEdit}
                >
                  Save Changes ({Object.keys(editedRecords).length})
                </Button>
                <Button
                  variant="outlined"
                  onClick={cancelChanges}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Marked Time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record) => {
                const editedRecord = editedRecords[record._id];
                const currentRecord = editedRecord || record;
                const isEdited = !!editedRecord;
                
                return (
                  <TableRow 
                    key={record._id}
                    sx={{ 
                      backgroundColor: isEdited ? 'action.hover' : 'inherit',
                      border: isEdited ? '2px solid' : 'none',
                      borderColor: isEdited ? 'primary.main' : 'transparent'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        {record.student.name}
                        {isEdited && <Edit fontSize="small" color="primary" />}
                      </Box>
                    </TableCell>
                    <TableCell>{record.student.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={currentRecord.status}
                        color={currentRecord.present ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {getMethodChip(record.method, record.biometricVerified)}
                    </TableCell>
                    <TableCell>
                      {record.markedAt ? new Date(record.markedAt).toLocaleTimeString() : '-'}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" disabled={!canEdit}>
                        <Select
                          value={currentRecord.status}
                          onChange={(e) => handleAttendanceChange(record._id, e.target.value)}
                        >
                          <MenuItem value="Present">Present</MenuItem>
                          <MenuItem value="Absent">Absent</MenuItem>
                          <MenuItem value="Late">Late</MenuItem>
                          <MenuItem value="Excused">Excused</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {attendanceData.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No attendance data found for selected course and date
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, data: null })}>
        <DialogTitle>Confirm Attendance Changes</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to update {confirmDialog.data?.recordCount} attendance record(s) for:
          </Typography>
          <Box sx={{ pl: 2, mt: 2 }}>
            <Typography variant="body2">
              <strong>Course:</strong> {confirmDialog.data?.course}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {confirmDialog.data?.date}
            </Typography>
            <Typography variant="body2">
              <strong>Faculty:</strong> {user?.name}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Alert severity="warning">
            These changes will be permanently saved to the database. 
            Make sure all modifications are accurate.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, data: null })}>
            Cancel
          </Button>
          <Button 
            onClick={confirmSave} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Confirm Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyAttendanceEdit;