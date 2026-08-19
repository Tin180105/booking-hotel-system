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
    authenticateJWT,
    requireAdminOrHotel,
} from "../../middlewares/auth.middleware";

const router = Router();


// ========================================
// HOTEL ROUTES
// ========================================

router.post(
    "/",
    authenticateJWT,
    requireAdminOrHotel,
    createHotel
);

router.get("/",getHotels);

router.get("/:id",getHotelById);

router.put(
    "/:id",
    authenticateJWT,
    requireAdminOrHotel,
    updateHotel
);

router.delete(
    "/:id",
    authenticateJWT,
    requireAdminOrHotel,
    deleteHotel
);

router.patch(
    "/:id/status",
    authenticateJWT,
    requireAdminOrHotel,
    updateHotelStatus
);

export default router;