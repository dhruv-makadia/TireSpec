import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Container, CssBaseline, Box, Typography, Paper } from '@mui/material'
import { ensureSession, clearSessionCookie } from './session.js'
import StepperPage from './StepperPage.jsx'
import CapturePage from './CapturePage.jsx'

function App() {
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    async function initSession() {
      try {
        await ensureSession()
        setSessionReady(true)
      } catch (error) {
        setSessionError(error?.message ?? 'Session initialization failed')
      }
    }

    initSession()
  }, [location.key])

  useEffect(() => {
    return () => {
      clearSessionCookie()
    }
  }, [])

  const content = useMemo(() => {
    if (!sessionReady) {
      return <Typography sx={{ p: 4 }}>Starting session...</Typography>
    }
    if (sessionError) {
      return <Typography color="error" sx={{ p: 4 }}>{sessionError}</Typography>
    }

    return (
      <Routes>
        <Route path="/" element={<StepperPage />} />
        <Route path="/capture" element={<CapturePage />} />
      </Routes>
    )
  }, [sessionReady, sessionError])

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#e7edf6', py: 4 }}>
        <Container maxWidth="sm">
          <Paper elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            {content}
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default App
