import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

// resolveHotelId: hàm async trả về hotel_id thực sự của resource đang thao tác
export const requireHotelOwnership = (
  resolveHotelId: (req: AuthRequest) => Promise<number | null>
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const roleCode = String(req.user?.roleCode || '').toLowerCase();

      // Admin có toàn quyền trên mọi khách sạn
      if (roleCode === 'admin') {
        return next();
      }

      if (roleCode !== 'hotel') {
        return res.status(403).json({
          status: 'error',
          message: 'Bạn không có quyền thực hiện chức năng này'
        });
      }

      const targetHotelId = await resolveHotelId(req);

      if (targetHotelId === null) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy tài nguyên'
        });
      }

      if (req.user?.hotelId !== targetHotelId) {
        return res.status(403).json({
          status: 'error',
          message: 'Bạn không có quyền trên khách sạn này'
        });
      }

      return next();

    } catch {
      return res.status(500).json({
        status: 'error',
        message: 'Lỗi kiểm tra quyền sở hữu'
      });
    }
  };
};