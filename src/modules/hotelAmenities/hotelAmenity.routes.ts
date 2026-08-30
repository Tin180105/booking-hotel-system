import { Router } from "express";
import { HotelAmenityController } from "./hotelAmenity.controller";
import {
  authenticateJWT as auth,
  role,
  AuthRequest
} from '../../middlewares/auth.middleware';
import { requireHotelOwnership } from '../../middlewares/ownership.middleware';

const router = Router();

router.get("/hotel/:hotelId", HotelAmenityController.getByHotelId);

router.post(
    "/",
    auth, role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const hotelId = Number(req.body.hotel_id);
        return Number.isInteger(hotelId) ? hotelId : null;
    }),
    HotelAmenityController.create
);

router.delete(
    "/",
    auth, role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const hotelId = Number(req.body.hotel_id);
        return Number.isInteger(hotelId) ? hotelId : null;
    }),
    HotelAmenityController.delete
);

export default router;