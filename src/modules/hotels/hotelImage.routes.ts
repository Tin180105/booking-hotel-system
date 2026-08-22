import { Router } from 'express';

import {
  getImages,
  getImage,
  createImage,
  setPrimary,
  deleteImage
} from './hotelImage.controller';

import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();


// ========================================
// GET IMAGES
// ========================================

router.get(
  '/hotels/:hotelId/images',
  auth, role('admin', 'hotel', 'customer'),
  getImages
);


// ========================================
// GET IMAGE
// ========================================

router.get(
  '/hotel-images/:id',
  auth, role('admin', 'hotel', 'customer'),
  getImage
);


// ========================================
// CREATE IMAGE
// ADMIN hoặc HOTEL
// ========================================

router.post(
  '/hotels/:hotelId/images',
  auth, role('admin', 'hotel', 'customer'),
  createImage
);


// ========================================
// SET PRIMARY
// ADMIN hoặc HOTEL
// ========================================

router.put(
  '/hotel-images/:id/primary',
  auth, role('admin', 'hotel', 'customer'),
  setPrimary
);


// ========================================
// DELETE
// ADMIN hoặc HOTEL
// ========================================

router.delete(
  '/hotel-images/:id',
  auth, role('admin', 'hotel', 'customer'),
  deleteImage
);

export default router;