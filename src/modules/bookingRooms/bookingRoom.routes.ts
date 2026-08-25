import { Router } from 'express';
import { BookingRoomController } from './bookingRoom.controller';

const router = Router();

router.get('/', BookingRoomController.getAll);

router.get('/booking/:bookingId',BookingRoomController.getByBookingId
);

router.get('/:id', BookingRoomController.getById);

router.post('/', BookingRoomController.create);

router.put('/:id', BookingRoomController.update);

router.delete('/:id', BookingRoomController.delete);

export default router;