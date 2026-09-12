import { Router } from 'express';

import { AmenityController } from './amenity.controller';

import {
    authenticateJWT as auth,
    role
} from '../../middlewares/auth.middleware';


const router = Router();


// ========================================
// AMENITIES
// ========================================

// Ai cũng có thể xem
router.get(
    '/',
    AmenityController.getAll
);

// Xem tổng quan từ VIEW
router.get(
    '/overview',
    AmenityController.getOverview
);

router.get(
    '/:id',
    AmenityController.getById
);


// Chỉ ADMIN
router.post(
    '/',
    auth,
    role('admin','hotel'),
    AmenityController.create
);

router.put(
    '/:id',
    auth,
    role('admin','hotel'),
    AmenityController.update
);

router.delete(
    '/:id',
    auth,
    role('admin','hotel'),
    AmenityController.delete
);

export default router;