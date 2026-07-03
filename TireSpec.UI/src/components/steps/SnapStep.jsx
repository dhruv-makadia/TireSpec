import { useState, useRef, useCallback } from 'react';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import { QRCodeSVG } from 'qrcode.react';

const SnapStep = ({ onImageCaptured, capturedImage, onIdentify, hubSessionId, onCancel }) => {
  const [showQr, setShowQr] = useState(false);
  const fileInputRef = useRef(null);

  const captureUrl = hubSessionId
    ? `${window.location.origin}/capture?key=${hubSessionId}`
    : '';

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onImageCaptured(ev.target.result);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }, [onImageCaptured]);

  const handleChange = () => {
    onImageCaptured(null);
    setShowQr(false);
  };

  // --- Image preview state ---
  if (capturedImage) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2,
            border: '3px solid',
            borderColor: 'primary.main',
          }}
        >
          <Box
            component="img"
            src={capturedImage}
            alt="Captured tire"
            sx={{
              width: '100%',
              maxHeight: 260,
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            }}
          >
            <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.75rem' }}>
              Your tire photo
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={handleChange}
              sx={{
                bgcolor: 'rgba(0,0,0,0.6)',
                fontSize: '0.7rem',
                py: 0.3,
                px: 1.5,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              Change
            </Button>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SearchIcon />}
          onClick={onIdentify}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}
        >
          Identify My Tire
        </Button>
      </Box>
    );
  }

  // --- QR Code view ---
  if (showQr) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Scan this QR code with your phone to open the camera
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            bgcolor: '#fff',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            mb: 2,
          }}
        >
          <QRCodeSVG value={captureUrl} size={180} level="M" />
        </Box>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>
          Waiting for photo from mobile device…
        </Typography>
        <Button variant="text" color="inherit" size="small" onClick={() => setShowQr(false)}>
          ← Back to options
        </Button>
      </Box>
    );
  }

  // --- Default: choose capture method ---
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        How would you like to capture the tire?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Paper
          onClick={() => setShowQr(true)}
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            cursor: 'pointer',
            border: '2px solid #e0e5eb',
            borderRadius: 2,
            textAlign: 'center',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(124,179,66,0.15)',
            },
          }}
        >
          <QrCode2Icon sx={{ fontSize: 36, color: 'secondary.main', mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Open Camera via QR Code
          </Typography>
        </Paper>

        <Paper
          onClick={() => fileInputRef.current?.click()}
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            cursor: 'pointer',
            border: '2px solid #e0e5eb',
            borderRadius: 2,
            textAlign: 'center',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(124,179,66,0.15)',
            },
          }}
        >
          <CameraAltIcon sx={{ fontSize: 36, color: 'secondary.main', mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Upload from PC
          </Typography>
        </Paper>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileSelect}
      />

      {onCancel && (
        <Button variant="text" color="inherit" size="small" onClick={onCancel} sx={{ mt: 1 }}>
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default SnapStep;
