import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import hotelRoutes from "./modules/hotels/hotel.routes";
import hotelImageRoutes from "./modules/hotels/hotelImage.routes";
import amenityRoutes from "./modules/amenities/amenity.routes";
import hotelAmenityRoutes from "./modules/hotelAmenities/hotelAmenity.routes";
import roomTypes from "./modules/roomTypes/roomType.routes";
import roomTypelmages from "./modules/roomTypeImages/roomTypeImage.routes";

const router = Router();

router.use("/api/roomTypelmages", roomTypelmages)
router.use("/api/roomTypes", roomTypes)
router.use("/api/hotelAmenities",hotelAmenityRoutes)
router.use("/api/amenities",amenityRoutes);
router.use("/api/auth",authRoutes);
router.use("/api/hotels",hotelRoutes);
router.use("/api",hotelImageRoutes);

export default router;