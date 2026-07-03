import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { submitContact } from '../../services/api';

const validationSchema = Yup.object({
  name: Yup.string().max(100, 'Name too long'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[\d\s()-]{7,20}$/, 'Enter a valid phone number'),
  email: Yup.string().email('Enter a valid email'),
});

const ContactDialog = ({ open, onClose }) => {
  const [submitState, setSubmitState] = useState({ loading: false, error: null, success: false });

  const formik = useFormik({
    initialValues: { name: '', phoneNumber: '', email: '' },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitState({ loading: true, error: null, success: false });
      try {
        await submitContact(values);
        setSubmitState({ loading: false, error: null, success: true });
        setTimeout(() => {
          handleClose();
        }, 1500);
      } catch {
        setSubmitState({
          loading: false,
          error: 'Failed to send request. Please try again.',
          success: false,
        });
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSubmitState({ loading: false, error: null, success: false });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon sx={{ color: 'error.main', fontSize: 20 }} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Get in touch
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.8rem' }}>
          Leave your details and a dealer will follow up with a quote.
        </Typography>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 1.5 }}>
          {submitState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitState.error}
            </Alert>
          )}
          {submitState.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Request sent! A dealer will contact you shortly.
            </Alert>
          )}

          <TextField
            id="contact-name"
            name="name"
            label="Your name (optional)"
            fullWidth
            margin="dense"
            size="small"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={submitState.loading || submitState.success}
          />
          <TextField
            id="contact-phone"
            name="phoneNumber"
            label="Phone number"
            required
            fullWidth
            margin="dense"
            size="small"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            disabled={submitState.loading || submitState.success}
          />
          <TextField
            id="contact-email"
            name="email"
            label="Email (optional)"
            fullWidth
            margin="dense"
            size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={submitState.loading || submitState.success}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitState.loading || submitState.success}
            startIcon={submitState.loading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ minWidth: 130 }}
          >
            {submitState.loading ? 'Sending…' : 'Send Request'}
          </Button>
          <Button onClick={handleClose} color="inherit" disabled={submitState.loading}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactDialog;
