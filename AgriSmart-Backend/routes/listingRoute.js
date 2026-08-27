import express from 'express';
import {
  browseListings,
  getListing,
  listMyListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { listingCreateSchema, listingUpdateSchema, validateListing } from '../validators/listingValidate.js';

const router = express.Router();

// Public browse + detail
router.get('/', browseListings);
router.get('/mine/list', isAuthenticated, listMyListings);
router.get('/:id', getListing);

// Authenticated farmer actions
router.post('/', isAuthenticated, validateListing(listingCreateSchema), createListing);
router.patch('/:id', isAuthenticated, validateListing(listingUpdateSchema), updateListing);
router.delete('/:id', isAuthenticated, deleteListing);

export default router;
