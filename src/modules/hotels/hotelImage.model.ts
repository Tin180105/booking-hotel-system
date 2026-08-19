import sql from 'mssql';
import { getConnection } from '../../config/database';

export interface HotelImageDTO {
  hotel_id: number;
  image_url: string;
  is_primary?: boolean;
}

export class HotelImageModel {

  // ========================================
  // GET IMAGES BY HOTEL
  // ========================================

  static async findByHotelId(
    hotelId: number
  ) {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input(
        'hotel_id',
        sql.BigInt,
        hotelId
      )
      .query(`
        SELECT
          id,
          hotel_id,
          image_url,
          is_primary
        FROM hotel_images
        WHERE hotel_id = @hotel_id
        ORDER BY is_primary DESC, id ASC
      `);

    return result.recordset;
  }


  // ========================================
  // GET IMAGE BY ID
  // ========================================

  static async findById(
    id: number
  ) {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input(
        'id',
        sql.BigInt,
        id
      )
      .query(`
        SELECT
          id,
          hotel_id,
          image_url,
          is_primary
        FROM hotel_images
        WHERE id = @id
      `);

    return result.recordset[0] || null;
  }


  // ========================================
  // CREATE IMAGE
  // ========================================

  static async create(
    data: HotelImageDTO
  ) {

    const pool = await getConnection();

    // Nếu ảnh này là ảnh chính
    // thì bỏ ảnh chính cũ
    if (data.is_primary) {

      await pool
        .request()
        .input(
          'hotel_id',
          sql.BigInt,
          data.hotel_id
        )
        .query(`
          UPDATE hotel_images
          SET is_primary = 0
          WHERE hotel_id = @hotel_id
        `);
    }

    const result = await pool
      .request()

      .input(
        'hotel_id',
        sql.BigInt,
        data.hotel_id
      )

      .input(
        'image_url',
        sql.VarChar,
        data.image_url
      )

      .input(
        'is_primary',
        sql.Bit,
        data.is_primary ?? false
      )

      .query(`
        INSERT INTO hotel_images
        (
          hotel_id,
          image_url,
          is_primary
        )

        OUTPUT
          INSERTED.id,
          INSERTED.hotel_id,
          INSERTED.image_url,
          INSERTED.is_primary

        VALUES
        (
          @hotel_id,
          @image_url,
          @is_primary
        )
      `);

    return result.recordset[0];
  }


  // ========================================
  // SET PRIMARY IMAGE
  // ========================================

  static async setPrimary(
    id: number
  ) {

    const image =
      await this.findById(id);

    if (!image) {
      return null;
    }

    const pool = await getConnection();

    // Bỏ ảnh chính hiện tại
    await pool
      .request()
      .input(
        'hotel_id',
        sql.BigInt,
        image.hotel_id
      )
      .query(`
        UPDATE hotel_images
        SET is_primary = 0
        WHERE hotel_id = @hotel_id
      `);

    // Đặt ảnh này thành ảnh chính
    const result = await pool
      .request()
      .input(
        'id',
        sql.BigInt,
        id
      )
      .query(`
        UPDATE hotel_images
        SET is_primary = 1
        OUTPUT
          INSERTED.id,
          INSERTED.hotel_id,
          INSERTED.image_url,
          INSERTED.is_primary
        WHERE id = @id
      `);

    return result.recordset[0];
  }


  // ========================================
  // DELETE IMAGE
  // ========================================

  static async delete(
    id: number
  ) {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input(
        'id',
        sql.BigInt,
        id
      )
      .query(`
        DELETE FROM hotel_images
        OUTPUT
          DELETED.id,
          DELETED.hotel_id,
          DELETED.image_url
        WHERE id = @id
      `);

    return result.recordset[0] || null;
  }
}