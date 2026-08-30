import { Router } from 'express';
import { BookingController } from './booking.controller';
import {
    authenticateJWT as auth,
    role
} from '../../middlewares/auth.middleware';

const router = Router();

// ADMIN xem tổng quan booking (view)
router.get('/overview', auth, role('admin'), BookingController.getOverview);

// ADMIN xem tất cả booking
router.get('/', auth, role('admin'), BookingController.getAll);

// ADMIN hoặc HOTEL xem theo hotel
router.get('/hotel/:hotelId', auth, role('admin', 'hotel'), BookingController.getByHotelId);

// Xem chi tiết 1 booking
router.get('/:id', auth, role('admin', 'hotel', 'customer'), BookingController.getById);

// Tạo booking mới (khách hàng đặt phòng)
router.post('/', auth, role('admin', 'customer'), BookingController.create);

// Sửa toàn bộ booking
router.put('/:id', auth, role('admin', 'hotel'), BookingController.update);

// Chỉ đổi trạng thái (dùng cho xác nhận/hủy nhanh)
router.patch('/:id/status', auth, role('admin', 'hotel'), BookingController.updateStatus);

// Xóa booking
router.delete('/:id', auth, role('admin'), BookingController.delete);

export default router;