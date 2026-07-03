import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import {
  CameraAlt,
  ContentCopy,
  Download,
  Edit,
  LeadPencil,
  Phone,
  QrCode,
  Share,
} from '@mui/icons-material'
import { identifyTire, fetchQuote, sendContact } from './api.js'

const steps = ['Snap', 'Identify', 'Quote']

const tireSchema = yup.object({
  brand: yup.string().required('Brand is required'),
  model: yup.string().required('Model is required'),
  tireSize: yup.string().required('Tire size is required'),
  dotCode: yup.string().required('DOT code is required'),
  dotYear: yup.string().required('DOT year is required'),
  loadIndex: yup.string().required('Load index is required'),
  speedRating: yup.string().required('Speed rating is required'),
})

const contactSchema = yup.object({
  name: yup.string().trim(),
  phoneNumber: yup.string().trim().required('Phone number is required'),
  email: yup.string().email('Enter a valid email').nullable(),
})

function createImageDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const defaultFormValues = {
  brand: '',
  model: '',
  tireSize: '',
  dotCode: '',
  dotYear: '',
  loadIndex: '',
  speedRating: '',
}

const defaultContactValues = {
  name: '',
  phoneNumber: '',
  email: '',
}

export default function StepperPage() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:900px)')
  const fileInputRef = useRef(null)

  const [activeStep, setActiveStep] = useState(0)
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [quoteResults, setQuoteResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const selectedMode = useMemo(() => {
    if (imageDataUrl) return 'photo'
    if (activeStep === 1 && !imageDataUrl && !scanResult) return 'manual'
    return 'idle'
  }, [activeStep, imageDataUrl, scanResult])

  useEffect(() => {
    if (activeStep === 1 && imageDataUrl && !scanResult) {
      identifyPhoto()
    }
  }, [activeStep, imageDataUrl, scanResult])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: scanResult ?? defaultFormValues,
    validationSchema: tireSchema,
    onSubmit: async (values) => {
      setError('')
      setLoading(true)
      try {
        const payload = {
          imageDataUrl: selectedMode === 'photo' ? imageDataUrl : null,
          manualData: values,
        }
        const response = await identifyTire(payload)
        setScanResult(response)
        await loadQuote(response)
        setActiveStep(2)
      } catch (err) {
        setError(err?.message ?? 'Unable to identify tire')
      } finally {
        setLoading(false)
      }
    },
  })

  const contactFormik = useFormik({
    initialValues: defaultContactValues,
    validationSchema: contactSchema,
    onSubmit: async (values, helpers) => {
      setError('')
      try {
        await sendContact(values)
        helpers.resetForm()
        setContactOpen(false)
        setSnackbar({ open: true, message: 'Contact request sent successfully.' })
      } catch (err) {
        setError(err?.message ?? 'Unable to send contact request')
      }
    },
  })

  async function identifyPhoto() {
    setError('')
    setLoading(true)
    try {
      const response = await identifyTire({ imageDataUrl, manualData: null })
      setScanResult(response)
    } catch (err) {
      setError(err?.message ?? 'Unable to identify tire')
    } finally {
      setLoading(false)
    }
  }

  async function loadQuote(tireData) {
    setError('')
    try {
      const response = await fetchQuote(tireData)
      setQuoteResults(response)
    } catch (err) {
      setError(err?.message ?? 'Unable to fetch quote')
    }
  }

  function handleFileSelect(event) {
    setError('')
    const file = event.target.files?.[0]
    if (!file) return
    createImageDataUrl(file)
      .then((dataUrl) => {
        setImageDataUrl(dataUrl)
        setScanResult(null)
        setActiveStep(1)
      })
      .catch(() => setError('Unable to read selected image.'))
  }

  function handleTakePhoto() {
    if (isMobile) {
      fileInputRef.current?.click()
      return
    }
    navigate('/capture?source=desktop')
  }

  function handleManualEntry() {
    setImageDataUrl(null)
    setScanResult(null)
    setActiveStep(1)
  }

  function handleReset() {
    setActiveStep(0)
    setImageDataUrl(null)
    setScanResult(null)
    setQuoteResults(null)
    setError('')
  }

  const isStep2Ready = activeStep === 2 && quoteResults

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f5f7fb' }}>
      <Box sx={{ background: '#07151f', color: '#fff', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            TireSpec
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
            SNAP · IDENTIFY · QUOTE
          </Typography>
        </Box>
        <Typography variant="button" sx={{ color: '#a1ff4e' }}>
          PWA Widget
        </Typography>
      </Box>

      <Box sx={{ p: 3, bgcolor: '#fff' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                How would you like to capture the tire?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<CameraAlt />}
                    onClick={handleTakePhoto}
                    sx={{ height: 120, flexDirection: 'column', pt: 2 }}>
                    {isMobile ? 'Take photo' : 'Take photo from mobile via QR'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<UploadFile />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ height: 120, flexDirection: 'column', pt: 2 }}>
                    Upload from device
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleManualEntry}
                    sx={{ height: 120, flexDirection: 'column', pt: 2 }}>
                    Enter tire data manually
                  </Button>
                </Grid>
              </Grid>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Confirm tire details
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Edit any field before we find recommendations.
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  {['brand', 'model', 'tireSize', 'dotCode', 'dotYear', 'loadIndex', 'speedRating'].map((field) => (
                    <Grid item xs={12} sm={field === 'tireSize' ? 12 : 6} key={field}>
                      <TextField
                        fullWidth
                        label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                        name={field}
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[field] && Boolean(formik.errors[field])}
                        helperText={formik.touched[field] && formik.errors[field]}
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Identifying…' : 'Looks right — Find replacements'}
                  </Button>
                  <Button variant="text" onClick={handleReset}>
                    Re-scan tire
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {isStep2Ready && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Tire identified — AI matched your tire and found replacements.
              </Alert>
              <Card sx={{ mb: 3, background: '#0f172a', color: '#fff' }}>
                <CardContent>
                  <Typography variant="h4">{scanResult.tireSize}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1, color: '#b6c3d8' }}>
                    {scanResult.brand} {scanResult.model}
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    {[
                      ['DOT Year', scanResult.dotYear],
                      ['Load Index', scanResult.loadIndex],
                      ['Speed Rating', scanResult.speedRating],
                    ].map(([label, value]) => (
                      <Grid key={label} item xs={4}>
                        <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {label}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Recommended replacements
              </Typography>
              <Grid container spacing={2}>
                {quoteResults.recommendations.map((item, index) => (
                  <Grid item xs={12} key={item.id}>
                    <Card variant="outlined" sx={{ borderLeft: index === 0 ? '4px solid #9be15d' : 'none' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.details}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {item.price}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.warranty}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
                <Button variant="contained" size="large" startIcon={<Phone />} onClick={() => setContactOpen(true)}>
                  Contact Me
                </Button>
                <Button variant="outlined" size="large" startIcon={<Share />} onClick={() => {
                  navigator.clipboard.writeText(`Quote for ${scanResult.brand} ${scanResult.model}: ${quoteResults.recommendations.map((item) => `${item.name} ${item.price}`).join(', ')}`)
                  setSnackbar({ open: true, message: 'Quote copied to clipboard' })
                }}>
                  Share Quote
                </Button>
              </Box>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="text" onClick={handleReset}>
                  Analyze another tire
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
        <DialogTitle>Get in touch</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Leave your details and a dealer will follow up with a quote.
          </Typography>
          <Box component="form" onSubmit={contactFormik.handleSubmit} noValidate>
            <TextField
              margin="dense"
              fullWidth
              label="Your name (optional)"
              name="name"
              value={contactFormik.values.name}
              onChange={contactFormik.handleChange}
            />
            <TextField
              margin="dense"
              fullWidth
              required
              label="Phone number"
              name="phoneNumber"
              value={contactFormik.values.phoneNumber}
              onChange={contactFormik.handleChange}
              error={contactFormik.touched.phoneNumber && Boolean(contactFormik.errors.phoneNumber)}
              helperText={contactFormik.touched.phoneNumber && contactFormik.errors.phoneNumber}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Email (optional)"
              name="email"
              value={contactFormik.values.email}
              onChange={contactFormik.handleChange}
              error={contactFormik.touched.email && Boolean(contactFormik.errors.email)}
              helperText={contactFormik.touched.email && contactFormik.errors.email}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactOpen(false)}>Cancel</Button>
          <Button onClick={contactFormik.submitForm} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  )
}
