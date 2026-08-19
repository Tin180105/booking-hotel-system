import bcrypt from 'bcryptjs';
import { AuthModel } from './auth.model';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt';

export class AuthService {
  static async register(fullName: string, email: string, password: string, roleId: number) {
    if (!Number.isInteger(roleId) || roleId <= 0) {
      throw new Error('role_id là bắt buộc và phải là số nguyên dương');
    }

    const existingUser = await AuthModel.findUserByEmail(email);
    if (existingUser) throw new Error('Email đã được sử dụng');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return await AuthModel.createUser({
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role_id: roleId,
    });
  }

  static async login(email: string, password: string) {
    const user = await AuthModel.findUserByEmail(email);
    if (!user || user.status !== 'ACTIVE') throw new Error('Email hoặc mật khẩu không đúng');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng');

    const roleCode = String(user.role_code || '').toUpperCase();
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      roleId: user.role_id,
      roleCode,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await AuthModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: { id: user.id, full_name: user.full_name, email: user.email, role_id: user.role_id },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    const storedToken = await AuthModel.findRefreshToken(token);
    if (!storedToken) throw new Error('Refresh Token không hợp lệ hoặc đã hết hạn');

    const decoded = verifyRefreshToken(token);
    const { accessToken } = generateTokens(decoded);

    return accessToken;
  }

  static async logout(token: string) {
    await AuthModel.revokeRefreshToken(token);
  }
}