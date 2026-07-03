import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, CircularProgress } from '@mui/material'

export default function CapturePage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Waiting for mobile photo upload...')
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
      setMessage('Ready for photo capture. This page will load the image from the mobile device.')
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480, bgcolor: '#fff', p: 3, borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Capture tire photo
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Scan this QR from your desktop and upload the tire photo from your mobile device.
        </Typography>
        {loading ? <CircularProgress /> : null}
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate('/')}>Return to app</Button>
      </Box>
    </Box>
  )
}
