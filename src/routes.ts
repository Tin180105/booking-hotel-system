import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import hotelRoutes from "./modules/hotels/hotel.routes";
import hotelImageRoutes from "./modules/hotels/hotelImage.routes";
import amenityRoutes from "./modules/amenities/amenity.routes";
import hotelAmenityRoutes from "./modules/hotelAmenities/hotelAmenity.routes";
import roomTypes from "./modules/roomTypes/roomType.routes";
import roomTypelmages from "./modules/roomTypeImages/roomTypeImage.routes";
import priceRulesRoutes from "./modules/priceRules/priceRule.routes";
import customerRoutes from './modules/customers/customer.routes';
import wishlistRoutes from './modules/wishlists/wishlist.routes';
import promotionRoutes from './modules/promotions/promotion.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import bookingRoomRoutes from './modules/bookingRooms/bookingRoom.routes';
import paymentRoutes from './modules/payments/payment.routes';
import payoutRoutes from './modules/payouts/payout.routes';



const router = Router();

router.use("/api/roomTypelmages", roomTypelmages)
router.use("/api/roomTypes", roomTypes)
router.use("/api/hotelAmenities",hotelAmenityRoutes)
router.use("/api/amenities",amenityRoutes);
router.use("/api/auth",authRoutes);
router.use("/api/hotels",hotelRoutes);
router.use("/api",hotelImageRoutes);
router.use("/api/priceRules", priceRulesRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/wishlists',wishlistRoutes);
router.use("/api/promotions", promotionRoutes)
router.use('/api/bookings', bookingRoutes);
router.use('/api/booking-rooms', bookingRoomRoutes);
router.use('/api/payments', paymentRoutes);
router.use('/api/payouts', payoutRoutes);


export default router;