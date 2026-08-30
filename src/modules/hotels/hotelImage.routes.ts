import { Router } from 'express';
import {getImages,getImage,createImage,setPrimary,deleteImage} from './hotelImage.controller';
import { HotelImageModel } from './hotelImage.model';
import {authenticateJWT as auth,role,AuthRequest} from '../../middlewares/auth.middleware';
import { requireHotelOwnership } from '../../middlewares/ownership.middleware';

const router = Router();

// PUBLIC — ai cũng xem được ảnh (khách chưa đăng nhập vẫn cần xem để đặt phòng)
router.get('/hotels/:hotelId/images', getImages);
router.get('/hotel-images/:id', getImage);

// CHỈ admin hoặc đúng hotel sở hữu mới được thêm/sửa/xóa
router.post('/hotels/:hotelId/images',auth,role('admin', 'hotel'),
requireHotelOwnership(async (req: AuthRequest) => {
    const hotelId = Number(req.params.hotelId);
    return Number.isInteger(hotelId) ? hotelId : null;
  }),
  createImage
);

router.put('/hotel-images/:id/primary',auth,role('admin', 'hotel'),
 requireHotelOwnership(async (req: AuthRequest) => {
    const image = await HotelImageModel.findById(Number(req.params.id));
    return image ? image.hotel_id : null;
  }),
  setPrimary
);

router.delete('/hotel-images/:id',auth,role('admin', 'hotel'),
  requireHotelOwnership(async (req: AuthRequest) => {
    const image = await HotelImageModel.findById(Number(req.params.id));
    return image ? image.hotel_id : null;
  }),
  deleteImage
);

export default router;