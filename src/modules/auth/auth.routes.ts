import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();

// Customer tự đăng ký
router.post('/register', AuthController.register);

// Đăng nhập
router.post('/login', AuthController.login);

// Refresh token
router.post('/refresh-token', AuthController.refreshToken);

// Logout
router.post('/logout', AuthController.logout);

// Update user
router.patch('/users/:id', AuthController.updateUser);

// Chỉ admin được xóa user
router.delete(
  '/users/:id',
  auth,
  role('admin'),
  AuthController.deleteUser
);

export default router;