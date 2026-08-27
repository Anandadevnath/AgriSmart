import * as yup from 'yup';
import { CROP_TYPES } from '../models/listingModel.js';

export const listingCreateSchema = yup.object().shape({
  cropType: yup.string().oneOf(CROP_TYPES).required('cropType is required'),
  title: yup.string().max(120).optional(),
  quantityKg: yup.number().min(0).required('quantityKg is required'),
  pricePerKg: yup.number().min(0).required('pricePerKg is required'),
  location: yup.object().shape({
    division: yup.string().required('division is required'),
    district: yup.string().required('district is required')
  }).required('location is required'),
  harvestDate: yup.date().optional(),
  photo: yup.string().optional(),
  description: yup.string().optional(),
});

export const listingUpdateSchema = yup.object().shape({
  cropType: yup.string().oneOf(CROP_TYPES).optional(),
  title: yup.string().max(120).optional(),
  quantityKg: yup.number().min(0).optional(),
  pricePerKg: yup.number().min(0).optional(),
  location: yup.object().shape({
    division: yup.string().optional(),
    district: yup.string().optional()
  }).optional(),
  harvestDate: yup.date().optional(),
  photo: yup.string().optional(),
  description: yup.string().optional(),
  status: yup.string().oneOf(['available', 'reserved', 'sold']).optional(),
});

export const validateListing = (schema) => (req, res, next) => {
  try {
    schema.validateSync(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    const errors = err.inner ? err.inner.map((e) => e.message) : [err.message];
    return res.status(400).json({ success: false, errors });
  }
};
