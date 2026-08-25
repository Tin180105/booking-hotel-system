import { Router } from 'express';
import { WishlistController } from './wishlist.controller';

const router = Router();

// ==========================================
// GET ALL
// ==========================================

router.get(
    '/',
    WishlistController.getAll
);


// ==========================================
// GET BY CUSTOMER
// ==========================================

router.get(
    '/customer/:customerId',
    WishlistController.getByCustomer
);


// ==========================================
// GET BY HOTEL
// ==========================================

router.get(
    '/hotel/:hotelId',
    WishlistController.getByHotel
);


// ==========================================
// GET ONE
// ==========================================

router.get(
    '/customer/:customerId/hotel/:hotelId',
    WishlistController.getOne
);


// ==========================================
// CREATE
// ==========================================

router.post(
    '/',
    WishlistController.create
);


// ==========================================
// UPDATE
// ==========================================

router.put(
    '/customer/:customerId/hotel/:hotelId',
    WishlistController.update
);


// ==========================================
// DELETE
// ==========================================

router.delete(
    '/customer/:customerId/hotel/:hotelId',
    WishlistController.delete
);

export default router;