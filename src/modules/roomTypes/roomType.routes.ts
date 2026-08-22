import { Router } from 'express';

import { RoomTypeController } from './roomType.controller';

import {
    authenticateJWT as auth,
    role
} from '../../middlewares/auth.middleware';

const router = Router();


// ========================================
// ROOM TYPES
// ========================================

// Xem tất cả loại phòng
router.get(
    '/',
    RoomTypeController.getAll
);


// Xem loại phòng của một hotel
router.get(
    '/hotel/:hotelId',
    RoomTypeController.getByHotelId
);


// Xem chi tiết loại phòng
router.get(
    '/:id',
    RoomTypeController.getById
);


// ADMIN hoặc HOTEL tạo loại phòng
router.post(
    '/',
    auth,
    role('admin', 'hotel'),
    RoomTypeController.create
);


// ADMIN hoặc HOTEL cập nhật
router.put(
    '/:id',
    auth,
    role('admin', 'hotel'),
    RoomTypeController.update
);


// ADMIN hoặc HOTEL xóa
router.delete(
    '/:id',
    auth,
    role('admin', 'hotel'),
    RoomTypeController.delete
);


export default router;