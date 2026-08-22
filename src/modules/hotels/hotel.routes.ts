import {
    Router,
} from "express";

import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    updateHotelStatus,
} from "./hotel.controller";

import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();


// ========================================
// HOTEL ROUTES
// ========================================

router.post(
    "/",
    auth, role('admin', 'hotel'),
    createHotel
);

router.get("/",getHotels);

router.get("/:id",getHotelById);

router.put(
    "/:id",
    auth, role('admin', 'hotel'),
    updateHotel
);

router.delete(
    "/:id",
    auth, role('admin', 'hotel'),
    deleteHotel
);

router.patch(
    "/:id/status",
    auth, role('admin', 'hotel'),
    updateHotelStatus
);

export default router;