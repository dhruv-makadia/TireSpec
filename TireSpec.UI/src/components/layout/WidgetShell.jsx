import { Box, Card } from '@mui/material';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const WidgetShell = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 0, sm: 2, md: 3 },
        pt: { xs: 0, sm: 3, md: 5 },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 480 },
          minHeight: { xs: '100vh', sm: 'auto' },
          borderRadius: { xs: 0, sm: '12px' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppHeader />
        <Box
          sx={{
            flex: 1,
            bgcolor: 'background.paper',
            px: { xs: 1.5, sm: 2 },
            py: 1,
          }}
        >
          {children}
        </Box>
        <AppFooter />
      </Card>
    </Box>
  );
};

export default WidgetShell;
