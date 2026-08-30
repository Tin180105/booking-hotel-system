import { Router } from 'express';

import { RoomTypeController } from './roomType.controller';
import { RoomTypeModel } from './roomType.model';

import {
    authenticateJWT as auth,
    role,
    AuthRequest
} from '../../middlewares/auth.middleware';

import { requireHotelOwnership } from '../../middlewares/ownership.middleware';

const router = Router();

router.get('/', RoomTypeController.getAll);
router.get('/overview', RoomTypeController.getOverview);
router.get('/hotel/:hotelId', RoomTypeController.getByHotelId);
router.get('/:id', RoomTypeController.getById);

router.post(
    '/',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const hotelId = Number(req.body.hotel_id);
        return Number.isInteger(hotelId) ? hotelId : null;
    }),
    RoomTypeController.create
);

router.put(
    '/:id',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const roomType = await RoomTypeModel.getById(Number(req.params.id));
        return roomType ? roomType.hotel_id : null;
    }),
    RoomTypeController.update
);

router.delete(
    '/:id',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const roomType = await RoomTypeModel.getById(Number(req.params.id));
        return roomType ? roomType.hotel_id : null;
    }),
    RoomTypeController.delete
);

export default router;