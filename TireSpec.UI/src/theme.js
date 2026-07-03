import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7cb342',
      light: '#aed581',
      dark: '#558b2f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1a2332',
      light: '#253446',
      dark: '#0f1620',
      contrastText: '#fff',
    },
    background: {
      default: '#e8ecf1',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2332',
      secondary: '#6b7a8d',
    },
    success: {
      main: '#7cb342',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontSize: '0.7rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7cb342 0%, #9ccc65 100%)',
          boxShadow: '0 4px 12px rgba(124,179,66,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #689f38 0%, #7cb342 100%)',
            boxShadow: '0 6px 16px rgba(124,179,66,0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
