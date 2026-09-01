import React, { useState, useContext } from 'react';
import { Paper, Typography, Box, Button, TextField, Alert, Grid, Chip, Card, CardContent } from '@mui/material';
import { QrCode, CheckCircle, School, People, Timer, Refresh } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNotifier } from '../layout/Notifier';
import axios from 'axios';

const QRAttendance = () => {
  const [qrCode, setQrCode] = useState('');
  const [scannedCode, setScannedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { user } = useContext(AuthContext);
  const notify = useNotifier();

  // Timer for QR expiry
  React.useEffect(() => {
    if (expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((new Date(expiresAt) - new Date()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          setQrCode('');
          setExpiresAt(null);
          setMessage('QR Code has expired. Generate a new one.');
          setMessageType('warning');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateQR = async () => {
    if (!user) {
      setMessage('Please login to generate QR codes');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/qr/generate', 
        { courseId: 'DEMO101' },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setQrCode(response.data.qrCode);
      setExpiresAt(response.data.expiresAt);
      setMessage('QR Code generated! Students can scan to mark attendance.');
      setMessageType('success');
      notify('QR Code generated successfully!', 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate QR code';
      setMessage(errorMsg);
      setMessageType('error');
      notify(errorMsg, 'error');
    }
    setLoading(false);
  };

  const scanQR = async () => {
    if (!scannedCode.trim()) {
      setMessage('Please enter a QR code');
      setMessageType('warning');
      return;
    }

    if (!user) {
      setMessage('Please login to scan QR codes');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/qr/scan', 
        { qrCode: scannedCode.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setMessage(response.data.message);
      setMessageType('success');
      setScannedCode('');
      notify('Attendance marked successfully!', 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to scan QR code';
      setMessage(errorMsg);
      setMessageType('error');
      notify(errorMsg, 'error');
    }
    setLoading(false);
  };

  const resetQR = () => {
    setQrCode('');
    setExpiresAt(null);
    setTimeLeft(0);
    setMessage('');
    setScannedCode('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Smart QR Attendance System
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Faculty Section - Generate QR */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Faculty: Generate QR Code
                </Typography>
              </Box>

              {user?.role === 'Faculty' || user?.role === 'Admin' ? (
                <Box>
                  {!qrCode ? (
                    <Button 
                      variant="contained" 
                      startIcon={<QrCode />}
                      onClick={generateQR}
                      disabled={loading}
                      fullWidth
                      size="large"
                    >
                      {loading ? 'Generating...' : 'Generate Attendance QR'}
                    </Button>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          border: '3px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          p: 3, 
                          mb: 2,
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <QrCode sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" sx={{ 
                          fontFamily: 'monospace', 
                          wordBreak: 'break-all',
                          backgroundColor: 'white',
                          p: 1,
                          borderRadius: 1,
                          border: '1px solid #ddd'
                        }}>
                          {qrCode}
                        </Typography>
                      </Box>
                      
                      {timeLeft > 0 && (
                        <Chip 
                          icon={<Timer />}
                          label={`Expires in: ${formatTime(timeLeft)}`}
                          color={timeLeft < 300 ? 'warning' : 'success'}
                          sx={{ mb: 2 }}
                        />
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<Refresh />}
                          onClick={generateQR}
                          disabled={loading}
                          size="small"
                        >
                          Regenerate
                        </Button>
                        <Button 
                          variant="text" 
                          onClick={resetQR}
                          size="small"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  Only Faculty and Admin can generate QR codes for attendance.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student Section - Scan QR */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Students: Scan QR Code
                </Typography>
              </Box>

              <Box>
                <TextField 
                  fullWidth
                  label="QR Code"
                  placeholder="Paste or type QR code here" 
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={scanQR}
                  disabled={loading || !scannedCode.trim()}
                  fullWidth
                  size="large"
                >
                  {loading ? 'Processing...' : 'Mark My Attendance'}
                </Button>

                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                  Copy the QR code from your instructor's screen and paste it above, 
                  or manually type it to mark your attendance.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12}>
          <Card elevation={1} sx={{ backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How It Works
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <QrCode sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      1. Faculty Generates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructors create time-limited QR codes for their classes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      2. Students Scan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students copy/paste the QR code to mark attendance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      3. Instant Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      System validates and records attendance automatically
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRAttendance;