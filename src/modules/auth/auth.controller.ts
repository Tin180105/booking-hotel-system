import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { full_name, email, password } = req.body;
      const roleId = Number(req.body.role_id ?? req.body.roleId);
      const user = await AuthService.register(full_name, email, password, roleId);
      res.status(201).json({ status: 'success', data: user });
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
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

      res.json({ status: 'success', data: { user, accessToken } });
    } catch (err: any) {
      res.status(401).json({ status: 'error', message: err.message });
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
}