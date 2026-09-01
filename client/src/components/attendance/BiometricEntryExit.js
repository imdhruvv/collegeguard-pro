// client/src/components/attendance/BiometricEntryExit.js
import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, Chip, LinearProgress, Stepper, Step, StepLabel
} from '@mui/material';
import { 
  Fingerprint, QrCode, CheckCircle, Error, Refresh, 
  PersonAdd, ExitToApp, Warning 
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNotifier } from '../layout/Notifier';
import { apiClient } from '../../config/api';

const BiometricEntryExit = () => {
  const { user } = useContext(AuthContext);
  const notify = useNotifier();
  const [currentStep, setCurrentStep] = useState(0);
  const [biometricData, setBiometricData] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showFallbackDialog, setShowFallbackDialog] = useState(false);
  const [attendanceType, setAttendanceType] = useState(null); // 'entry' or 'exit'

  const steps = ['Select Action', 'Biometric Scan', 'Verification', 'Complete'];

  // Simulate biometric scanner initialization
  useEffect(() => {
    // In a real implementation, this would initialize the biometric SDK
    console.log('Biometric scanner initialized');
  }, []);

  const startBiometricScan = async (type) => {
    setAttendanceType(type);
    setCurrentStep(1);
    setLoading(true);
    
    try {
      // Simulate biometric scanner activation
      await simulateBiometricScan();
      setCurrentStep(2);
    } catch (error) {
      console.error('Biometric scan failed:', error);
      setShowFallbackDialog(true);
    }
    setLoading(false);
  };

  const simulateBiometricScan = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 85% success rate for biometric
        if (Math.random() > 0.15) {
          setBiometricData({
            fingerprint: `FP_${user._id}_${Date.now()}`,
            quality: Math.floor(Math.random() * 30) + 70, // 70-100% quality
            timestamp: new Date()
          });
          resolve();
        } else {
          reject(new Error('Biometric scan failed'));
        }
      }, 3000);
    });
  };

  const verifyAndSubmit = async () => {
    setLoading(true);
    setCurrentStep(3);
    
    try {
      const endpoint = attendanceType === 'entry' ? '/api/attendance/biometric-entry' : '/api/attendance/biometric-exit';
      
      await apiClient.post(endpoint, {
        userId: user._id,
        biometricData: biometricData,
        fallbackUsed: fallbackMode,
        qrCode: fallbackMode ? qrCode : null
      });
      
      setScanResult({
        success: true,
        message: `${attendanceType === 'entry' ? 'Check-in' : 'Check-out'} successful!`,
        time: new Date().toLocaleString()
      });
      
      notify(`Biometric ${attendanceType} recorded successfully!`, 'success');
      setCurrentStep(4);
      
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Verification failed',
        time: new Date().toLocaleString()
      });
      notify('Verification failed. Please try again.', 'error');
    }
    setLoading(false);
  };

  const handleFallbackQR = () => {
    setFallbackMode(true);
    setShowFallbackDialog(false);
    setCurrentStep(2);
    
    // Generate fallback QR code
    const fallbackQR = `FALLBACK_${attendanceType.toUpperCase()}_${user._id}_${Date.now()}`;
    setQrCode(fallbackQR);
    
    setBiometricData({
      fingerprint: null,
      quality: 0,
      timestamp: new Date(),
      fallback: true
    });
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setBiometricData(null);
    setFallbackMode(false);
    setQrCode('');
    setScanResult(null);
    setAttendanceType(null);
    setShowFallbackDialog(false);
  };

  const BiometricScanner = () => (
    <Card elevation={3} sx={{ textAlign: 'center', p: 3, mb: 3 }}>
      <CardContent>
        {loading ? (
          <Box>
            <Fingerprint sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {fallbackMode ? 'Processing Fallback QR...' : 'Scanning Fingerprint...'}
            </Typography>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Please keep your finger steady on the scanner
            </Typography>
          </Box>
        ) : biometricData ? (
          <Box>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {fallbackMode ? 'Fallback QR Generated' : 'Fingerprint Captured'}
            </Typography>
            <Chip 
              label={`Quality: ${biometricData.quality}%`} 
              color={biometricData.quality > 80 ? 'success' : 'warning'}
              sx={{ mb: 2 }}
            />
            {fallbackMode && (
              <Box sx={{ 
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 2,
                mt: 2,
                backgroundColor: '#f8f9fa'
              }}>
                <QrCode sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {qrCode}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Fingerprint sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Place finger on scanner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Position your finger on the biometric scanner
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (currentStep === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Anti-Proxy Biometric System
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Anti-Proxy Security:</strong> This system uses biometric fingerprint scanning 
          to ensure authentic attendance. QR fallback is available if biometric fails.
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Card sx={{ minWidth: 250, textAlign: 'center' }}>
            <CardContent>
              <PersonAdd sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Check In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Record your entry to campus
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => startBiometricScan('entry')}
              >
                Start Check-In
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 250, textAlign: 'center' }}>
            <CardContent>
              <ExitToApp sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Check Out
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Record your exit from campus
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                fullWidth
                onClick={() => startBiometricScan('exit')}
              >
                Start Check-Out
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {attendanceType === 'entry' ? 'Biometric Check-In' : 'Biometric Check-Out'}
      </Typography>

      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {currentStep === 1 && <BiometricScanner />}

      {currentStep === 2 && (
        <Card elevation={3} sx={{ textAlign: 'center', p: 3, mb: 3 }}>
          <CardContent>
            <Warning sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Verify Your Identity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {fallbackMode ? 
                'Using QR fallback method. Please confirm your identity.' :
                'Fingerprint captured successfully. Please confirm to proceed.'
              }
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={verifyAndSubmit}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Confirm Identity'}
              </Button>
              <Button variant="outlined" onClick={resetProcess}>
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && scanResult && (
        <Card elevation={3} sx={{ textAlign: 'center', p: 3, mb: 3 }}>
          <CardContent>
            {scanResult.success ? (
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            ) : (
              <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            )}
            <Typography variant="h6" gutterBottom>
              {scanResult.message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Time: {scanResult.time}
            </Typography>
            
            {fallbackMode && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Fallback QR method was used. Please ensure proper biometric setup for next time.
              </Alert>
            )}
            
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={resetProcess}
            >
              New Scan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fallback Dialog */}
      <Dialog open={showFallbackDialog} onClose={() => setShowFallbackDialog(false)}>
        <DialogTitle>Biometric Scan Failed</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            The biometric scanner could not read your fingerprint. This could be due to:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>Dirty or wet finger</li>
            <li>Scanner hardware issue</li>
            <li>Poor finger placement</li>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Would you like to use the QR fallback method?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFallbackDialog(false)}>
            Try Again
          </Button>
          <Button onClick={handleFallbackQR} variant="contained">
            Use QR Fallback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BiometricEntryExit;