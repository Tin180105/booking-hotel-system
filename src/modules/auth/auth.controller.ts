import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
  try {
    const {
      full_name,
      email,
      password,
      phone
    } = req.body;

    const user =
      await AuthService.registerCustomer(
        full_name,
        email,
        password,
        phone
      );

    res.status(201).json({
      status: 'success',
      data: user
    });

  } catch (err: any) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log('[AuthController.login] success', {
        userId: user.id,
        email: user.email,
        role_code: user.role_code,
      });

      res.json({ status: 'success', data: { user, accessToken } });
    } catch (err: any) {
      console.error('[AuthController.login] failed', {
        email: req.body?.email,
        message: err?.message,
        stack: err?.stack,
      });
      res.status(401).json({ status: 'error', message: err.message || 'Đăng nhập thất bại' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) {
        res.status(400).json({ status: 'error', message: 'Yêu cầu Refresh Token' });
        return;
      }
      const accessToken = await AuthService.refreshToken(token);
      res.json({ status: 'success', data: { accessToken } });
    } catch (err: any) {
      res.status(403).json({ status: 'error', message: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (token) await AuthService.logout(token);
      res.clearCookie('refreshToken');
      res.json({ status: 'success', message: 'Đăng xuất thành công' });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      const user = await AuthService.updateUser(userId, req.body);
      res.json({ status: 'success', data: user });
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      await AuthService.deleteUser(userId);
      res.json({ status: 'success', message: 'Xóa tài khoản thành công' });
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  static async listUsers(req: Request, res: Response) {
    try {
      const roleCode = req.query.role ? String(req.query.role) : undefined;
      const users = await AuthService.listUsers(roleCode);
      res.json({ status: 'success', data: users });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }
}