import bcrypt from 'bcryptjs';
import { AuthModel } from './auth.model';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt';

export class AuthService {
  static async register(
    fullName: string,
    email: string,
    password: string,
    roleId: number,
    hotelId: number | null = null,
    phone: string | null = null
  ) {
    if (!Number.isInteger(roleId) || roleId <= 0) {
      throw new Error('role_id là bắt buộc và phải là số nguyên dương');
    }

    if (hotelId !== null && (!Number.isInteger(hotelId) || hotelId <= 0)) {
      throw new Error('hotel_id phải là số nguyên dương');
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
      hotel_id: hotelId,
      phone,
    });
  }

  // ========================================
// REGISTER CUSTOMER
// ========================================

static async registerCustomer(
  fullName: string,
  email: string,
  password: string,
  phone: string | null = null
) {
  // Kiểm tra email
  const existingUser = await AuthModel.findUserByEmail(email);

  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Lấy role CUSTOMER
  const customerRole =
    await AuthModel.findRoleByCode('customer');

  if (!customerRole) {
    throw new Error('Không tìm thấy role customer');
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);

  const passwordHash =
    await bcrypt.hash(password, salt);

  // Tạo customer
  return await AuthModel.createUser({
    full_name: fullName,
    email,
    password_hash: passwordHash,
    role_id: customerRole.id,
    hotel_id: null,
    phone
  });
}

  static async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('[AuthService.login] start', {
      email: normalizedEmail,
      passwordLength: password.length,
    });

    const user = await AuthModel.findUserByEmail(normalizedEmail);
    console.log('[AuthService.login] user lookup', user ? {
      id: user.id,
      email: user.email,
      status: user.status,
      role_code: user.role_code,
      hasPasswordHash: Boolean(user.password_hash),
    } : null);

    if (!user || user.status !== 'ACTIVE') {
      console.error('[AuthService.login] user not found or inactive', { email: normalizedEmail, user: user ? { id: user.id, status: user.status } : null });
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const passwordHash = String(user.password_hash ?? '');
    const isLegacyPlaintext = passwordHash && passwordHash === password;
    const isMatch = isLegacyPlaintext || await bcrypt.compare(password, passwordHash);

    console.log('[AuthService.login] password check', {
      isLegacyPlaintext,
      passwordHashStartsWithBcrypt: passwordHash.startsWith('$2'),
      isMatch,
    });

    if (!isMatch) {
      console.error('[AuthService.login] password mismatch', {
        email: normalizedEmail,
        passwordHashPreview: passwordHash.slice(0, 20),
      });
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    if (isLegacyPlaintext) {
      const newHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
      await AuthModel.updatePasswordHash(user.id, newHash);
      console.log('[AuthService.login] migrated legacy plaintext password to bcrypt hash', { userId: user.id });
    }

    const roleCode = String(user.role_code || '').toUpperCase();
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      roleId: user.role_id,
      roleCode,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await AuthModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: { id: user.id, full_name: user.full_name, email: user.email, role_id: user.role_id, role_code: user.role_code },
      accessToken,
      refreshToken,
    };
  }

  static async updateUser(userId: number, data: {
    full_name?: string;
    email?: string;
    phone?: string | null;
    hotel_id?: number | null;
    password?: string;
  }) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('user_id không hợp lệ');
    }

    const currentUser = await AuthModel.findUserById(userId);
    if (!currentUser) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const hotelId = data.hotel_id !== undefined
      ? data.hotel_id
      : currentUser.hotel_id;
    if (hotelId !== null && (!Number.isInteger(hotelId) || hotelId <= 0)) {
      throw new Error('hotel_id phải là số nguyên dương');
    }

    const fullName = data.full_name ?? currentUser.full_name;
    const email = data.email ?? currentUser.email;
    if (!fullName.trim() || !email.trim()) {
      throw new Error('full_name và email không được để trống');
    }

    if (email !== currentUser.email) {
      const existingUser = await AuthModel.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email đã được sử dụng');
      }
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, await bcrypt.genSalt(10))
      : currentUser.password_hash;

    return await AuthModel.updateUser(userId, {
      full_name: fullName,
      email,
      phone: data.phone !== undefined ? data.phone : currentUser.phone,
      hotel_id: hotelId,
      password_hash: passwordHash,
    });
  }

  static async deleteUser(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('user_id không hợp lệ');
    }

    const currentUser = await AuthModel.findUserById(userId);
    if (!currentUser) {
      throw new Error('Không tìm thấy tài khoản');
    }

    await AuthModel.deleteUser(userId);
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