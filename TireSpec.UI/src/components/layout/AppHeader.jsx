import { Box, Typography } from '@mui/material';

const AppHeader = () => {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        px: { xs: 2, sm: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px 12px 0 0',
      }}
    >
      <Box>
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '0.03em',
          }}
        >
          <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
            Tire
          </Box>
          <Box component="span" sx={{ color: '#fff', fontStyle: 'italic' }}>
            Spec
          </Box>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#8a9bb0',
            fontSize: '0.55rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            mt: -0.3,
          }}
        >
          BY <Box component="span" sx={{ fontWeight: 700, color: '#aab8c9' }}>TRAXXION</Box>
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#8a9bb0',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          SNAP · IDENTIFY
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'primary.main',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          QUOTE · SELL
        </Typography>
      </Box>
    </Box>
  );
};

export default AppHeader;
