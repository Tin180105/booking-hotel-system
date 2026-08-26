import { Router } from 'express';
import { BookingController } from './booking.controller';

const router = Router();

router.get('/overview', BookingController.getOverview);

router.get('/', BookingController.getAll);

router.get('/:id', BookingController.getById);

router.post('/', BookingController.create);

router.put('/:id', BookingController.update);

router.delete('/:id', BookingController.delete);

export default router;