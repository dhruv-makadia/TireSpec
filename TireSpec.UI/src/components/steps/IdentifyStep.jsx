import { Box, Typography, TextField, MenuItem, Button, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const conditions = ['-- unknown --', 'New', 'Good', 'Fair', 'Worn', 'Replace Immediately'];

const validationSchema = Yup.object({
  brand: Yup.string().required('Brand is required'),
  model: Yup.string().required('Model is required'),
  tireSize: Yup.string().required('Tire size is required'),
  dotCode: Yup.string(),
  dotYear: Yup.string(),
  loadIndex: Yup.string(),
  speedRating: Yup.string(),
  condition: Yup.string(),
});

const IdentifyStep = ({ tireData, onConfirm, onRescan }) => {
  const formik = useFormik({
    initialValues: {
      brand: tireData?.brand || '',
      model: tireData?.model || '',
      tireSize: tireData?.tireSize || '',
      dotCode: tireData?.dotCode || '',
      dotYear: tireData?.dotYear || '',
      loadIndex: tireData?.loadIndex || '',
      speedRating: tireData?.speedRating || '',
      condition: '-- unknown --',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onConfirm(values);
    },
  });

  return (
    <Box>
      {/* Success banner */}
      <Alert
        icon={<CheckCircleIcon />}
        severity="success"
        sx={{ borderRadius: 2, mb: 2 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'none', letterSpacing: 0 }}>
          Confirm tire details
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
          Tap any field to correct it before we find replacements.
        </Typography>
      </Alert>

      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            id="tire-brand"
            name="brand"
            label="Brand"
            size="small"
            value={formik.values.brand}
            onChange={formik.handleChange}
            error={formik.touched.brand && Boolean(formik.errors.brand)}
          />
          <TextField
            id="tire-model"
            name="model"
            label="Model"
            size="small"
            value={formik.values.model}
            onChange={formik.handleChange}
            error={formik.touched.model && Boolean(formik.errors.model)}
          />
          <TextField
            id="tire-size"
            name="tireSize"
            label="Tire Size"
            size="small"
            value={formik.values.tireSize}
            onChange={formik.handleChange}
            error={formik.touched.tireSize && Boolean(formik.errors.tireSize)}
          />
          <TextField
            id="tire-dot-code"
            name="dotCode"
            label="DOT Code"
            size="small"
            value={formik.values.dotCode}
            onChange={formik.handleChange}
          />
          <TextField
            id="tire-dot-year"
            name="dotYear"
            label="DOT Year"
            size="small"
            value={formik.values.dotYear}
            onChange={formik.handleChange}
          />
          <TextField
            id="tire-load-index"
            name="loadIndex"
            label="Load Index"
            size="small"
            value={formik.values.loadIndex}
            onChange={formik.handleChange}
          />
          <TextField
            id="tire-speed-rating"
            name="speedRating"
            label="Speed Rating"
            size="small"
            value={formik.values.speedRating}
            onChange={formik.handleChange}
          />
          <TextField
            id="tire-condition"
            name="condition"
            label="Condition"
            select
            size="small"
            value={formik.values.condition}
            onChange={formik.handleChange}
            sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
          >
            {conditions.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{ py: 1.5, fontSize: '0.95rem', fontWeight: 700, mb: 1 }}
        >
          Looks right — Find Replacements
        </Button>
      </form>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          startIcon={<ReplayIcon sx={{ fontSize: 16 }} />}
          variant="text"
          color="inherit"
          size="small"
          onClick={onRescan}
          sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
        >
          Re-scan tire
        </Button>
      </Box>
    </Box>
  );
};

export default IdentifyStep;
