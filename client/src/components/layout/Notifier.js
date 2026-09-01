import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotifierContext = createContext();

export const useNotifier = () => useContext(NotifierContext);

export const NotifierProvider = ({ children }) => {
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });

  const notify = (message, severity = 'info') => setSnack({ open: true, message, severity });

  const handleClose = () => setSnack({ ...snack, open: false });

  return (
    <NotifierContext.Provider value={notify}>
      {children}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </NotifierContext.Provider>
  );
};