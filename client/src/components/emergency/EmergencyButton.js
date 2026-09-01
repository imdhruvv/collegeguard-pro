import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { Emergency } from '@mui/icons-material';
import axios from 'axios';

const EmergencyButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmergency = async () => {
    setLoading(true);
    try {
      // FIXED: Use the new emergency endpoint (no auth required)
      await axios.post('http://localhost:5000/api/security/emergency', {
        eventType: 'Emergency Alert',
        location: 'Student Report',
        priority: 'High',
        description: message || 'Emergency reported by student'
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      alert('Failed to send emergency alert. Please try again or contact campus security directly.');
    }
    setLoading(false);
  };

  return (
    <>
      <Fab 
        color="error" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
      >
        <Emergency />
      </Fab>
      
      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Emergency Alert</DialogTitle>
        <DialogContent>
          {sent ? (
            <Alert severity="success">Emergency alert sent to admin!</Alert>
          ) : (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This will immediately notify campus security and administrators.
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Describe the emergency (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleEmergency}
            disabled={sent || loading}
          >
            {loading ? 'Sending...' : 'Send Alert'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmergencyButton;