import { Router } from 'express';

import {
    authenticateJWT as auth,
    role
} from '../../middlewares/auth.middleware';

import { RoomTypeImageController }
    from './roomTypeImage.controller';

const router = Router();


// ========================================
// ROOM TYPE IMAGES
// ========================================

// Lấy tất cả hình ảnh
router.get(
    '/',
    RoomTypeImageController.getAll
);


// Lấy hình ảnh của một loại phòng
router.get(
    '/room-type/:roomTypeId',
    RoomTypeImageController.getByRoomTypeId
);


// Lấy hình ảnh theo ID
router.get(
    '/:id',
    RoomTypeImageController.getById
);


// ADMIN hoặc HOTEL thêm hình ảnh
router.post(
    '/',
    auth,
    role('admin', 'hotel'),
    RoomTypeImageController.create
);


// ADMIN hoặc HOTEL cập nhật
router.put(
    '/:id',
    auth,
    role('admin', 'hotel'),
    RoomTypeImageController.update
);


// ADMIN hoặc HOTEL xóa
router.delete(
    '/:id',
    auth,
    role('admin', 'hotel'),
    RoomTypeImageController.delete
);


export default router;