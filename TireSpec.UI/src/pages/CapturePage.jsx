import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  createCaptureConnection,
  joinSession,
  submitPhoto,
} from '../services/captureHub';

const CapturePage = () => {
  const [searchParams] = useSearchParams();
  const hubKey = searchParams.get('key');

  const [status, setStatus] = useState('connecting'); // connecting | ready | captured | sent | error
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const connectionRef = useRef(null);

  // --- Start camera ---
  const startCamera = useCallback(async (facing) => {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setStatus('error');
    }
  }, []);

  // --- Connect to SignalR hub ---
  useEffect(() => {
    if (!hubKey) {
      setStatus('error');
      return;
    }

    const connection = createCaptureConnection();
    connectionRef.current = connection;

    const init = async () => {
      try {
        await connection.start();
        await joinSession(connection, hubKey);
        setStatus('ready');
        await startCamera(facingMode);
      } catch {
        setStatus('error');
      }
    };

    init();

    return () => {
      connection.stop().catch(() => {});
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [hubKey]);

  // --- Capture photo ---
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    setStatus('captured');

    // Stop stream after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  }, []);

  // --- Send photo ---
  const handleSend = useCallback(async () => {
    if (!capturedImage || !connectionRef.current || !hubKey) return;

    try {
      await submitPhoto(connectionRef.current, hubKey, capturedImage);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }, [capturedImage, hubKey]);

  // --- Retake ---
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setStatus('ready');
    startCamera(facingMode);
  }, [facingMode, startCamera]);

  // --- Toggle camera ---
  const toggleCamera = useCallback(() => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startCamera(newFacing);
  }, [facingMode, startCamera]);

  if (!hubKey) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">Invalid capture link. Please scan the QR code again.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{ color: '#fff', fontWeight: 700 }}
        >
          <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>Tire</Box>
          <Box component="span" sx={{ fontStyle: 'italic' }}>Spec</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: '#888' }}>
          Point your camera at the tire sidewall
        </Typography>
      </Box>

      {/* Camera / Preview area */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {status === 'connecting' && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#fff' }} />
            <Typography sx={{ color: '#888', mt: 2 }}>Connecting…</Typography>
          </Box>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ m: 2 }}>
            Camera or connection error. Please ensure camera access is allowed.
          </Alert>
        )}

        {(status === 'ready') && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}

        {(status === 'captured' || status === 'sent') && capturedImage && (
          <Box
            component="img"
            src={capturedImage}
            alt="Captured tire"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}

        {status === 'sent' && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.6)',
              zIndex: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Photo sent!
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5 }}>
              You can close this window now.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Bottom controls */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {status === 'ready' && (
          <>
            <IconButton onClick={toggleCamera} sx={{ color: '#fff' }}>
              <FlipCameraAndroidIcon />
            </IconButton>
            <IconButton
              onClick={handleCapture}
              sx={{
                bgcolor: '#fff',
                width: 64,
                height: 64,
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              <CameraAltIcon sx={{ fontSize: 28, color: '#000' }} />
            </IconButton>
            <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
          </>
        )}

        {status === 'captured' && (
          <>
            <Button variant="outlined" onClick={handleRetake} sx={{ color: '#fff', borderColor: '#555' }}>
              Retake
            </Button>
            <Button variant="contained" color="primary" onClick={handleSend} sx={{ px: 4 }}>
              Use This Photo
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CapturePage;
