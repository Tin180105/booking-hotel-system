import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {

  user?: {
    userId: number;
    roleId: number;
    roleCode: string;
  };

}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    authHeader.startsWith('Bearer ')
  ) {

    const token =
      authHeader.split(' ')[1];

    try {

      req.user =
        verifyAccessToken(token);

      next();

    } catch (err) {

      res.status(401).json({
        status: 'error',
        message:
          'Access Token không hợp lệ hoặc đã hết hạn'
      });

    }

  } else {

    res.status(401).json({
      status: 'error',
      message:
        'Yêu cầu Header Authorization'
    });

  }
};


// ========================================
// CHECK ADMIN
// ========================================

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  // Chưa đăng nhập
  if (!req.user) {

    return res.status(401).json({
      status: 'error',
      message: 'Chưa đăng nhập'
    });

  }

  // Kiểm tra role
  if (String(req.user.roleCode || '').toUpperCase() !== 'ADMIN') {

    return res.status(403).json({
      status: 'error',
      message:
        'Chỉ ADMIN mới được thực hiện chức năng này'
    });

  }

  next();
};

export const requireAdminOrHotel = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Chưa đăng nhập'
    });
  }

  const roleCode = String(req.user.roleCode || '').toUpperCase();

  if (roleCode !== 'ADMIN' && roleCode !== 'HOTEL') {
    return res.status(403).json({
      status: 'error',
      message: 'Chỉ ADMIN hoặc HOTEL mới được thực hiện chức năng này'
    });
  }

  next();
};