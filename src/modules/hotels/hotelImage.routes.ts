import { Router } from 'express';

import {
  getImages,
  getImage,
  createImage,
  setPrimary,
  deleteImage
} from './hotelImage.controller';

import {
  authenticateJWT,
  requireAdminOrHotel
} from '../../middlewares/auth.middleware';

const router = Router();


// ========================================
// GET IMAGES
// ========================================

router.get(
  '/hotels/:hotelId/images',
  getImages
);


// ========================================
// GET IMAGE
// ========================================

router.get(
  '/hotel-images/:id',
  getImage
);


// ========================================
// CREATE IMAGE
// ADMIN hoặc HOTEL
// ========================================

router.post(
  '/hotels/:hotelId/images',
  authenticateJWT,
  requireAdminOrHotel,
  createImage
);


// ========================================
// SET PRIMARY
// ADMIN hoặc HOTEL
// ========================================

router.put(
  '/hotel-images/:id/primary',
  authenticateJWT,
  requireAdminOrHotel,
  setPrimary
);


// ========================================
// DELETE
// ADMIN hoặc HOTEL
// ========================================

router.delete(
  '/hotel-images/:id',
  authenticateJWT,
  requireAdminOrHotel,
  deleteImage
);

export default router;