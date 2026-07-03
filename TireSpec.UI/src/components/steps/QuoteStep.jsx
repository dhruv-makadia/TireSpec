import { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, Divider, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIcon from '@mui/icons-material/Phone';
import ShareIcon from '@mui/icons-material/Share';
import ReplayIcon from '@mui/icons-material/Replay';
import ContactDialog from '../common/ContactDialog';

const QuoteStep = ({ tireData, quotes, onReset }) => {
  const [contactOpen, setContactOpen] = useState(false);

  const recommendations = quotes?.recommendations || [];

  return (
    <Box>
      {/* Tire Identified banner */}
      <Alert
        icon={<CheckCircleIcon />}
        severity="success"
        sx={{ borderRadius: 2, mb: 2 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'none', letterSpacing: 0 }}>
          Tire Identified
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
          AI matched your tire — here's your instant quote.
        </Typography>
      </Alert>

      {/* Tire summary card */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
          {tireData?.tireSize || '—'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {tireData?.brand} {tireData?.model}
        </Typography>
      </Paper>

      {/* Specs chips */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'DOT Year', value: tireData?.dotYear },
          { label: 'Load Index', value: tireData?.loadIndex },
          { label: 'Speed Rating', value: tireData?.speedRating },
        ].map((spec) => (
          <Paper
            key={spec.label}
            elevation={0}
            sx={{
              border: '1px solid #e0e5eb',
              borderRadius: 2,
              px: 2,
              py: 1,
              textAlign: 'center',
              minWidth: 80,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
              }}
            >
              {spec.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {spec.value || '—'}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Recommendations */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          color: 'text.secondary',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
        }}
      >
        RECOMMENDED REPLACEMENTS
      </Typography>

      {recommendations.map((tire, index) => (
        <Paper
          key={tire.id}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            mb: 1,
            border: index === 0 ? '2px solid' : '1px solid',
            borderColor: index === 0 ? 'primary.main' : '#e0e5eb',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: index === 0 ? 'primary.main' : '#e0e5eb',
              color: index === 0 ? '#fff' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              mr: 1.5,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {tire.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              {tire.warranty || 'In Stock'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 700, ml: 1, flexShrink: 0 }}>
            {tire.price}
          </Typography>
        </Paper>
      ))}

      {/* Action buttons */}
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CalendarMonthIcon />}
          sx={{ py: 1.5, fontSize: '0.95rem', fontWeight: 700, mb: 1.5 }}
        >
          Book Appointment
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhoneIcon />}
            onClick={() => setContactOpen(true)}
          >
            Contact Me
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ShareIcon />}
          >
            Share Quote
          </Button>
        </Box>
      </Box>

      {/* Reset */}
      <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
        <Button
          startIcon={<ReplayIcon sx={{ fontSize: 16 }} />}
          variant="text"
          color="inherit"
          size="small"
          onClick={onReset}
          sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
        >
          Analyze another tire
        </Button>
      </Box>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </Box>
  );
};

export default QuoteStep;
