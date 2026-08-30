import { Router } from 'express';
import { BookingController } from './booking.controller';
import {authenticateJWT as auth,role} from'../../middlewares/auth.middleware';
const router = Router();

router.get('/',auth,role('admin'),BookingController.getAll);

router.get('/hotel/:hotelId',auth,role('admin', 'hotel'),BookingController.getByHotelId);

router.get('/:id',auth,role('admin', 'hotel'),BookingController.getById);

router.patch( '/:id/status',auth,role('admin', 'hotel'),BookingController.updateStatus);

export default router;