import { Box, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const AppFooter = () => {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        px: { xs: 2, sm: 3 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '0 0 12px 12px',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#6b7a8d',
          fontSize: '0.6rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        POWERED BY{' '}
        <Box component="span" sx={{ fontWeight: 700, color: '#aab8c9' }}>
          TRAXXION
        </Box>{' '}
        SOCR
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CheckCircleOutlinedIcon sx={{ color: 'primary.main', fontSize: 14 }} />
        <Typography
          variant="caption"
          sx={{
            color: '#6b7a8d',
            fontSize: '0.6rem',
            letterSpacing: '0.05em',
          }}
        >
          Live API
        </Typography>
      </Box>
    </Box>
  );
};

export default AppFooter;
