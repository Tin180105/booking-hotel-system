import { Router } from 'express';
import { PayoutController } from './payout.controller';
import {
  authenticateJWT as auth,
  role,
  AuthRequest
} from '../../middlewares/auth.middleware';
import { requireHotelOwnership } from '../../middlewares/ownership.middleware';

const router = Router();

// ADMIN: tạo payout
router.post('/', auth, role('admin'), PayoutController.createPayout);

// ADMIN: xem tất cả payout
router.get('/', auth, role('admin'), PayoutController.getPayouts);

// ADMIN hoặc HOTEL (chỉ xem của chính mình): xem payout theo hotel
router.get(
  '/hotel/:hotelId',
  auth,
  role('admin', 'hotel'),
  requireHotelOwnership(async (req: AuthRequest) => {
    const hotelId = Number(req.params.hotelId);
    return Number.isInteger(hotelId) ? hotelId : null;
  }),
  PayoutController.getByHotelId
);

// ADMIN: xem chi tiết 1 payout
router.get('/:id', auth, role('admin'), PayoutController.getPayoutById);

// ADMIN: cập nhật (đổi trạng thái, ngày chi trả...)
router.put('/:id', auth, role('admin'), PayoutController.updatePayout);

// ADMIN: xoá
router.delete('/:id', auth, role('admin'), PayoutController.deletePayout);

export default router;