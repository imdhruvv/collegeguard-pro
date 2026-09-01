import { createTheme } from '@mui/material/styles';

// Define light and dark mode palettes
const lightPalette = {
  primary: {
    main: '#1976d2', // Blue for trust
    light: '#63a4ff',
    dark: '#004ba0',
  },
  secondary: {
    main: '#4caf50', // Green for academic features
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
};

const darkPalette = {
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#5d99c6',
  },
  secondary: {
    main: '#81c784',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
  },
};

// Base theme configuration
const themeOptions = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Avoid uppercase buttons for modern look
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          transition: 'transform 0.2s ease-in-out', // Animation for buttons
          '&:hover': {
            transform: 'scale(1.05)', // Subtle scale on hover
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
    },
  },
});

// Export themes for light and dark modes
export const lightTheme = createTheme(themeOptions('light'));
export const darkTheme = createTheme(themeOptions('dark'));