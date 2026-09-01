import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from './theme'; // Changed from 'theme' to 'lightTheme'
import { CssBaseline } from '@mui/material';
import { NotifierProvider } from './components/layout/Notifier';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <LoadingProvider>
          <NotifierProvider>
            <App />
          </NotifierProvider>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);