import { Router } from "express";
import { HotelAmenityController } from "./hotelAmenity.controller";
import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();

router.get(
    "/hotel/:hotelId",
    HotelAmenityController.getByHotelId
);

router.post(
    "/",
    auth, role('admin', 'hotel'),
    HotelAmenityController.create
);

router.delete(
    "/",
    auth, role('admin', 'hotel'),
    HotelAmenityController.delete
);

export default router;