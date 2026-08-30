import { Router } from 'express';

import {
    authenticateJWT as auth,
    role,
    AuthRequest
} from '../../middlewares/auth.middleware';

import { requireHotelOwnership } from '../../middlewares/ownership.middleware';

import { RoomTypeImageController } from './roomTypeImage.controller';
import { RoomTypeImageModel } from './roomTypeImage.model';
import { RoomTypeModel } from '../roomTypes/roomType.model';

const router = Router();

router.get('/', RoomTypeImageController.getAll);
router.get('/room-type/:roomTypeId', RoomTypeImageController.getByRoomTypeId);
router.get('/:id', RoomTypeImageController.getById);

router.post(
    '/',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const roomType = await RoomTypeModel.getById(Number(req.body.room_type_id));
        return roomType ? roomType.hotel_id : null;
    }),
    RoomTypeImageController.create
);

router.put(
    '/:id',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const image = await RoomTypeImageModel.getById(Number(req.params.id));
        return image ? image.hotel_id : null;
    }),
    RoomTypeImageController.update
);

router.delete(
    '/:id',
    auth,
    role('admin', 'hotel'),
    requireHotelOwnership(async (req: AuthRequest) => {
        const image = await RoomTypeImageModel.getById(Number(req.params.id));
        return image ? image.hotel_id : null;
    }),
    RoomTypeImageController.delete
);

export default router;