import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const steps = ['SNAP', 'IDENTIFY', 'QUOTE'];

const StepProgress = ({ activeStep = 0 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, px: 2 }}>
      {steps.map((label, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        return (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Step circle */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isCompleted || isActive ? 'primary.main' : '#d0d5dc',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 0 4px rgba(124,179,66,0.2)' : 'none',
                }}
              >
                {isCompleted ? <CheckIcon sx={{ fontSize: 16 }} /> : index + 1}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  fontSize: '0.6rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isCompleted || isActive ? 'primary.main' : '#8a9bb0',
                  letterSpacing: '0.08em',
                }}
              >
                {label}
              </Typography>
            </Box>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  width: { xs: 50, sm: 80 },
                  height: 2,
                  bgcolor: index < activeStep ? 'primary.main' : '#d0d5dc',
                  mx: 0.5,
                  mt: -1.5,
                  transition: 'background-color 0.3s ease',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default StepProgress;
