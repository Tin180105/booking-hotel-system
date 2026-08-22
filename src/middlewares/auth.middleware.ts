import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';


// ========================================
// AUTH REQUEST
// ========================================

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    roleId: number;
    roleCode: string;
  };
}


// ========================================
// AUTHENTICATE JWT
// ========================================

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization;

  // Không có Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return res.status(401).json({
      status: 'error',
      message: 'Yêu cầu Header Authorization'
    });

  }

  // Lấy token
  const token = authHeader.split(' ')[1];

  try {

    // Verify token
    req.user = verifyAccessToken(token);

    next();

  } catch (error) {

    return res.status(401).json({
      status: 'error',
      message: 'Access Token không hợp lệ hoặc đã hết hạn'
    });

  }
};


// ========================================
// CHECK ROLE
// ========================================
//
// Ví dụ:
//
// role('admin')
// role('admin', 'hotel')
// role('admin', 'hotel', 'customer')
//
// Phải kết hợp với authenticateJWT:
//
// authenticateJWT,
// role('admin'),
// controller.create
//
// ========================================

export const role = (...allowedRoles: string[]) => {

  return (
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

    // Role của user hiện tại
    const userRole = String(
      req.user.roleCode || ''
    ).toLowerCase();


    // Các role được phép
    const roles = allowedRoles.map(
      item => String(item).toLowerCase()
    );


    // Kiểm tra role
    if (!roles.includes(userRole)) {

      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền thực hiện chức năng này'
      });

    }

    next();
  };
};