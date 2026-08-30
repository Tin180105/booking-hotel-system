import sql from 'mssql';
import { getConnection } from '../../config/database';

export interface UserRegisterDTO {
  full_name: string;
  email: string;
  phone?: string | null;
  password_hash: string;
  role_id: number;
  hotel_id?: number | null;
}

export interface UserUpdateDTO {
  full_name: string;
  email: string;
  phone?: string | null;
  hotel_id?: number | null;
  password_hash: string;
}

export class AuthModel {

  // ========================================
  // FIND USER BY EMAIL
  // ========================================

  static async findUserByEmail(email: string) {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('email', sql.VarChar, email.trim().toLowerCase())
      .query(`
        SELECT
          u.id,
          u.role_id,
          u.hotel_id,
          u.full_name,
          u.email,
          u.phone,
          u.password_hash,
          u.status,
          r.code AS role_code,
          r.name AS role_name

        FROM users u

        INNER JOIN roles r
          ON u.role_id = r.id

        WHERE LOWER(u.email) = LOWER(@email)
      `);

    return result.recordset[0] || null;
  }

  static async updatePasswordHash(userId: number, passwordHash: string) {
    const pool = await getConnection();

    await pool
      .request()
      .input('user_id', sql.BigInt, userId)
      .input('password_hash', sql.VarChar, passwordHash)
      .query(`
        UPDATE users
        SET password_hash = @password_hash
        WHERE id = @user_id
      `);
  }

    static async findRoleByCode(roleCode: string) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('role_code', sql.VarChar, roleCode)
      .query(`
        SELECT
          id,
          code,
          name
        FROM roles
        WHERE LOWER(code) = LOWER(@role_code)
      `);

    return result.recordset[0] || null;
  }

  // ========================================
  // CREATE USER
  // ========================================

  static async createUser(
    data: UserRegisterDTO
  ) {

    const pool = await getConnection();

    const result = await pool
      .request()

      .input(
        'role_id',
        sql.BigInt,
        data.role_id
      )

      .input(
        'hotel_id',
        sql.BigInt,
        data.hotel_id ?? null
      )

      .input(
        'full_name',
        sql.NVarChar,
        data.full_name
      )

      .input(
        'email',
        sql.VarChar,
        data.email
      )

      .input(
        'phone',
        sql.VarChar,
        data.phone ?? null
      )

      .input(
        'password_hash',
        sql.VarChar,
        data.password_hash
      )

      .query(`
        INSERT INTO users
        (
          role_id,
          hotel_id,
          full_name,
          email,
          phone,
          password_hash,
          status
        )

        OUTPUT
          INSERTED.id,
          INSERTED.role_id,
          INSERTED.hotel_id,
          INSERTED.full_name,
          INSERTED.email,
          INSERTED.phone,
          INSERTED.status

        VALUES
        (
          @role_id,
          @hotel_id,
          @full_name,
          @email,
          @phone,
          @password_hash,
          'ACTIVE'
        )
      `);

    return result.recordset[0];
  }

  static async findUserById(userId: number) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('user_id', sql.BigInt, userId)
      .query(`
        SELECT
          u.id,
          u.role_id,
          u.hotel_id,
          u.full_name,
          u.email,
          u.phone,
          u.password_hash,
          u.status,
          r.code AS role_code,
          r.name AS role_name
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = @user_id
      `);

    return result.recordset[0] || null;
  }

  static async updateUser(userId: number, data: UserUpdateDTO) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('user_id', sql.BigInt, userId)
      .input('full_name', sql.NVarChar, data.full_name)
      .input('email', sql.VarChar, data.email)
      .input('phone', sql.VarChar, data.phone ?? null)
      .input('hotel_id', sql.BigInt, data.hotel_id ?? null)
      .input('password_hash', sql.VarChar, data.password_hash)
      .query(`
        UPDATE u
        SET
          hotel_id = @hotel_id,
          full_name = @full_name,
          email = @email,
          phone = @phone,
          password_hash = @password_hash
        OUTPUT
          INSERTED.id,
          INSERTED.role_id,
          INSERTED.hotel_id,
          INSERTED.full_name,
          INSERTED.email,
          INSERTED.phone,
          INSERTED.status
        FROM users u
        WHERE u.id = @user_id
      `);

    return result.recordset[0] || null;
  }

  static async deleteUser(userId: number) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('user_id', sql.BigInt, userId)
      .query(`
        DELETE u
        OUTPUT DELETED.id
        FROM users u
        WHERE u.id = @user_id
      `);

    return result.rowsAffected[0] > 0;
  }


  // ========================================
  // SAVE REFRESH TOKEN
  // ========================================

  static async saveRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date
  ) {

    const pool = await getConnection();

    await pool
      .request()

      .input(
        'user_id',
        sql.BigInt,
        userId
      )

      .input(
        'token',
        sql.VarChar,
        token
      )

      .input(
        'expires_at',
        sql.DateTime2,
        expiresAt
      )

      .query(`
        INSERT INTO refresh_tokens
        (
          user_id,
          token,
          expires_at
        )

        VALUES
        (
          @user_id,
          @token,
          @expires_at
        )
      `);
  }


  // ========================================
  // FIND REFRESH TOKEN
  // ========================================

  static async findRefreshToken(
    token: string
  ) {

    const pool = await getConnection();

    const result = await pool
      .request()

      .input(
        'token',
        sql.VarChar,
        token
      )

      .query(`
        SELECT *
        FROM refresh_tokens
        WHERE token = @token
          AND revoked_at IS NULL
          AND expires_at > GETDATE()
      `);

    return result.recordset[0] || null;
  }


  // ========================================
  // REVOKE REFRESH TOKEN
  // ========================================

  static async revokeRefreshToken(
    token: string
  ) {

    const pool = await getConnection();

    await pool
      .request()

      .input(
        'token',
        sql.VarChar,
        token
      )

      .query(`
        UPDATE refresh_tokens
        SET revoked_at = GETDATE()
        WHERE token = @token
      `);
  }

    // ========================================
  // FIND ALL USERS (ADMIN)
  // ========================================

  static async findAllUsers(roleCode?: string) {

    const pool = await getConnection();

    const request = pool.request();

    let query = `
      SELECT
        u.id,
        u.role_id,
        u.hotel_id,
        u.full_name,
        u.email,
        u.phone,
        u.status,
        u.created_at,
        r.code AS role_code,
        r.name AS role_name,
        h.name AS hotel_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN hotels h ON u.hotel_id = h.id
    `;

    if (roleCode) {
      query += ` WHERE r.code = @role_code`;
      request.input('role_code', sql.VarChar, roleCode);
    }

    query += ` ORDER BY u.created_at DESC`;

    const result = await request.query(query);

    return result.recordset;
  }
}