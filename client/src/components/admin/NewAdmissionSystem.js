// client/src/components/admin/NewAdmissionSystem.js - Clean version
import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, Grid, Alert,
  Stepper, Step, StepLabel, Avatar, Chip,
  List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab
} from '@mui/material';
import { 
  Fingerprint, Save, Check, Person, Security 
} from '@mui/icons-material';
import { useNotifier } from '../layout/Notifier';

const NewAdmissionSystem = () => {
  
  const notify = useNotifier();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form data for new admission
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Academic Information
    role: 'Student', // Student or Faculty
    studentId: '',
    employeeId: '',
    department: '',
    course: '',
    semester: '',
    joiningDate: new Date().toISOString().split('T')[0],
    
    // Security Information
    password: '',
    confirmPassword: '',
    biometricEnrolled: false,
    rfidCardId: '',
    securityLevel: 'Basic'
  });

  const [biometricData, setBiometricData] = useState(null);
  const [recentAdmissions, setRecentAdmissions] = useState([]);

  const steps = ['Basic Info', 'Academic Details', 'Security Setup', 'Verification', 'Complete'];
  
  const departments = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 
    'Biology', 'English', 'History', 'Economics', 'Engineering'
  ];

  const courses = {
    'Computer Science': ['CS101', 'CS201', 'CS301'],
    'Mathematics': ['MATH101', 'MATH201', 'MATH301'],
    'Physics': ['PHYS101', 'PHYS201', 'PHYS301'],
    'Engineering': ['ENG101', 'ENG201', 'ENG301']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate IDs
    if (field === 'role') {
      if (value === 'Student') {
        setFormData(prev => ({
          ...prev,
          studentId: `STU${Date.now().toString().slice(-6)}`,
          employeeId: ''
        }));
      } else if (value === 'Faculty') {
        setFormData(prev => ({
          ...prev,
          employeeId: `FAC${Date.now().toString().slice(-6)}`,
          studentId: ''
        }));
      }
    }
  };

  const simulateBiometricEnrollment = () => {
    setLoading(true);
    
    setTimeout(() => {
      setBiometricData({
        fingerprints: [`FP1_${formData.name}_${Date.now()}`, `FP2_${formData.name}_${Date.now()}`],
        quality: Math.floor(Math.random() * 30) + 70,
        enrolled: true,
        timestamp: new Date()
      });
      
      setFormData(prev => ({ ...prev, biometricEnrolled: true }));
      notify('Biometric enrollment completed successfully!', 'success');
      setLoading(false);
    }, 3000);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Info
        return formData.name && formData.email && formData.phone && formData.dateOfBirth;
      case 1: // Academic Details
        return formData.role && formData.department && 
               (formData.role === 'Student' ? formData.course && formData.semester : true);
      case 2: // Security Setup
        return formData.password && formData.password === formData.confirmPassword;
      case 3: // Verification
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      notify('Please fill in all required fields', 'warning');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const submitAdmission = async () => {
    setLoading(true);
    
    try {
      // Generate RFID card ID
      const rfidId = `RFID${Date.now().toString().slice(-8)}`;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to recent admissions
      const newAdmission = {
        id: Date.now(),
        name: formData.name,
        role: formData.role,
        department: formData.department,
        studentId: formData.studentId,
        employeeId: formData.employeeId,
        rfidCardId: rfidId,
        createdAt: new Date()
      };
      
      setRecentAdmissions(prev => [newAdmission, ...prev.slice(0, 9)]);
      
      notify(`${formData.role} admission completed successfully!`, 'success');
      setCurrentStep(4);
      
    } catch (error) {
      notify('Failed to complete admission. Please try again.', 'error');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '',
      emergencyContact: '', emergencyPhone: '', role: 'Student', studentId: '',
      employeeId: '', department: '', course: '', semester: '',
      joiningDate: new Date().toISOString().split('T')[0],
      password: '', confirmPassword: '', biometricEnrolled: false,
      rfidCardId: '', securityLevel: 'Basic'
    });
    setBiometricData(null);
    setCurrentStep(0);
  };

  const BasicInfoStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Emergency Contact Name"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );

  const AcademicDetailsStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
          >
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {formData.role === 'Student' && (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student ID"
              value={formData.studentId}
              disabled
              helperText="Auto-generated"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
              >
                {(courses[formData.department] || []).map(course => (
                  <MenuItem key={course} value={course}>{course}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
              >
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
      
      {formData.role === 'Faculty' && (
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Employee ID"
            value={formData.employeeId}
            disabled
            helperText="Auto-generated"
          />
        </Grid>
      )}
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Joining Date"
          value={formData.joiningDate}
          onChange={(e) => handleInputChange('joiningDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const SecuritySetupStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={formData.password !== formData.confirmPassword}
                  helperText={formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Security Level</InputLabel>
                  <Select
                    value={formData.securityLevel}
                    onChange={(e) => handleInputChange('securityLevel', e.target.value)}
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Enhanced">Enhanced</MenuItem>
                    <MenuItem value="Maximum">Maximum</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Biometric Enrollment
            </Typography>
            
            {!biometricData ? (
              <Box>
                <Fingerprint sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enroll fingerprints for secure attendance
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Fingerprint />}
                  onClick={simulateBiometricEnrollment}
                  disabled={loading}
                >
                  {loading ? 'Enrolling...' : 'Start Enrollment'}
                </Button>
              </Box>
            ) : (
              <Box>
                <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main" gutterBottom>
                  Enrollment Complete
                </Typography>
                <Chip 
                  label={`Quality: ${biometricData.quality}%`}
                  color="success"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {biometricData.fingerprints.length} fingerprints enrolled
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const VerificationStep = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Review Admission Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Basic Information</Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Phone: {formData.phone}</Typography>
            <Typography>Role: {formData.role}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Academic Details</Typography>
            <Typography>Department: {formData.department}</Typography>
            {formData.role === 'Student' && (
              <>
                <Typography>Student ID: {formData.studentId}</Typography>
                <Typography>Course: {formData.course}</Typography>
                <Typography>Semester: {formData.semester}</Typography>
              </>
            )}
            {formData.role === 'Faculty' && (
              <Typography>Employee ID: {formData.employeeId}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Security Status</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                label={formData.biometricEnrolled ? 'Biometric Enrolled' : 'No Biometric'} 
                color={formData.biometricEnrolled ? 'success' : 'warning'}
                icon={<Fingerprint />}
              />
              <Chip 
                label={`Security Level: ${formData.securityLevel}`}
                color="info"
                icon={<Security />}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        New Admission System - Anti-Proxy Registration
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="New Admission" />
        <Tab label="Recent Admissions" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            This system registers new students and faculty with biometric enrollment 
            to prevent proxy attendance and ensure secure campus access.
          </Alert>

          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card>
            <CardContent>
              {currentStep === 0 && <BasicInfoStep />}
              {currentStep === 1 && <AcademicDetailsStep />}
              {currentStep === 2 && <SecuritySetupStep />}
              {currentStep === 3 && <VerificationStep />}
              {currentStep === 4 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Check sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" color="success.main" gutterBottom>
                    Admission Complete!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {formData.name} has been successfully admitted as {formData.role}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                    <Chip label={`ID: ${formData.role === 'Student' ? formData.studentId : formData.employeeId}`} />
                    <Chip label={`Department: ${formData.department}`} />
                    <Chip label="Biometric Enrolled" color="success" />
                  </Box>
                  <Button variant="contained" onClick={resetForm}>
                    Add Another Person
                  </Button>
                </Box>
              )}

              {currentStep < 4 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button 
                      variant="contained" 
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      onClick={submitAdmission}
                      disabled={loading}
                      startIcon={<Save />}
                    >
                      {loading ? 'Processing...' : 'Complete Admission'}
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Admissions
            </Typography>
            
            {recentAdmissions.length === 0 ? (
              <Typography color="text.secondary">
                No recent admissions. Use the New Admission tab to add students or faculty.
              </Typography>
            ) : (
              <List>
                {recentAdmissions.map((admission) => (
                  <ListItem key={admission.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: admission.role === 'Student' ? 'primary.main' : 'secondary.main' }}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={admission.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {admission.role} - {admission.department}
                          </Typography>
                          <Typography variant="caption">
                            ID: {admission.studentId || admission.employeeId} | 
                            RFID: {admission.rfidCardId} | 
                            Added: {admission.createdAt.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={admission.role} 
                      color={admission.role === 'Student' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NewAdmissionSystem;