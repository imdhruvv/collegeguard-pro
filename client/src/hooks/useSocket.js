// client/src/hooks/useSocket.js
import { useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useNotifier } from '../components/layout/Notifier';
import { AuthContext } from '../context/AuthContext';

const useSocket = () => {
  const notify = useNotifier();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');

    // Listen for resource updates
    socket.on('resourceUpdate', (data) => {
      // Only notify admins about high usage
      if (user.role === 'Admin') {
        if (data.electricity > 280) {
          notify('High electricity usage detected!', 'warning');
        }
        if (data.water > 140) {
          notify('High water usage detected!', 'warning');
        }
      }
    });

    // Listen for security alerts
    socket.on('securityAlert', (alert) => {
      if (user.role === 'Admin') {
        notify(`Security Alert: ${alert.eventType} at ${alert.location}`, 'error');
      }
    });

    // Listen for emergency alerts
    socket.on('emergencyAlert', (emergency) => {
      if (user.role === 'Admin' || user.role === 'Faculty') {
        notify(`EMERGENCY: ${emergency.description}`, 'error');
      }
    });

    return () => socket.disconnect();
  }, [user, notify]);
};

export default useSocket;