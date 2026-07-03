import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import WidgetShell from '../components/layout/WidgetShell';
import StepProgress from '../components/common/StepProgress';
import SnapStep from '../components/steps/SnapStep';
import IdentifyStep from '../components/steps/IdentifyStep';
import QuoteStep from '../components/steps/QuoteStep';
import { createSession, scanTire, getQuotes } from '../services/api';
import { setSessionToken, getSessionToken, clearSession } from '../services/cookie';
import {
  createCaptureConnection,
  joinSession,
  onTirePhotoCaptured,
} from '../services/captureHub';

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const guid = searchParams.get('guid');

  // Session state
  const [sessionState, setSessionState] = useState({
    loading: true,
    error: null,
    initialized: false,
  });

  // Step flow
  const [activeStep, setActiveStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [tireData, setTireData] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [processing, setProcessing] = useState(false);

  // SignalR
  const [hubSessionId] = useState(() => crypto.randomUUID());
  const connectionRef = useRef(null);

  // --- Clear cookie on page close / tab close ---
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // --- Session initialization ---
  useEffect(() => {
    if (!guid) {
      setSessionState({ loading: false, error: 'Missing guid parameter. Please provide a valid dealer link.', initialized: false });
      return;
    }

    // Skip if we already have a valid token
    if (getSessionToken()) {
      setSessionState({ loading: false, error: null, initialized: true });
      return;
    }

    let cancelled = false;

    const initSession = async () => {
      try {
        const data = await createSession(guid);
        if (cancelled) return;
        setSessionToken(data.jwt, data.expire);
        setSessionState({ loading: false, error: null, initialized: true });
      } catch (err) {
        if (cancelled) return;
        const msg = err.response?.data?.message || 'Failed to create session. Please check your link.';
        setSessionState({ loading: false, error: msg, initialized: false });
      }
    };

    initSession();
    return () => { cancelled = true; };
  }, [guid]);

  // --- SignalR connection for QR capture ---
  useEffect(() => {
    if (!sessionState.initialized) return;

    const connection = createCaptureConnection();
    connectionRef.current = connection;

    const startHub = async () => {
      try {
        await connection.start();
        await joinSession(connection, hubSessionId);

        onTirePhotoCaptured(connection, (data) => {
          setCapturedImage(data.imageDataUrl);
        });
      } catch (err) {
        console.warn('SignalR connection failed:', err);
      }
    };

    startHub();

    return () => {
      connection.stop().catch(() => {});
    };
  }, [sessionState.initialized, hubSessionId]);

  // --- Handlers ---
  const handleImageCaptured = useCallback((image) => {
    setCapturedImage(image);
  }, []);

  const handleIdentify = useCallback(async () => {
    setProcessing(true);
    try {
      const data = await scanTire(capturedImage);
      setTireData(data);
      setActiveStep(1);
    } catch (err) {
      console.error('Tire scan failed:', err);
    } finally {
      setProcessing(false);
    }
  }, [capturedImage]);

  const handleConfirmTire = useCallback(async (confirmedData) => {
    setProcessing(true);
    try {
      const data = await getQuotes(confirmedData);
      setTireData(confirmedData);
      setQuotes(data);
      setActiveStep(2);
    } catch (err) {
      console.error('Quote fetch failed:', err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleRescan = useCallback(() => {
    setCapturedImage(null);
    setTireData(null);
    setActiveStep(0);
  }, []);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setTireData(null);
    setQuotes(null);
    setActiveStep(0);
  }, []);

  // --- Render ---
  if (sessionState.loading) {
    return (
      <WidgetShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Initializing session…
          </Typography>
        </Box>
      </WidgetShell>
    );
  }

  if (sessionState.error) {
    return (
      <WidgetShell>
        <Box sx={{ py: 4, px: 1 }}>
          <Alert severity="error">{sessionState.error}</Alert>
        </Box>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell>
      <StepProgress activeStep={activeStep} />

      {processing ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {activeStep === 0 ? 'Scanning tire…' : 'Finding replacements…'}
          </Typography>
        </Box>
      ) : (
        <>
          {activeStep === 0 && (
            <SnapStep
              capturedImage={capturedImage}
              onImageCaptured={handleImageCaptured}
              onIdentify={handleIdentify}
              hubSessionId={hubSessionId}
              onCancel={null}
            />
          )}
          {activeStep === 1 && (
            <IdentifyStep
              tireData={tireData}
              onConfirm={handleConfirmTire}
              onRescan={handleRescan}
            />
          )}
          {activeStep === 2 && (
            <QuoteStep
              tireData={tireData}
              quotes={quotes}
              onReset={handleReset}
            />
          )}
        </>
      )}
    </WidgetShell>
  );
};

export default MainPage;
