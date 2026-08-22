import sql from 'mssql';
import { getConnection } from '../../config/database';

export const RoomTypeImageModel = {

    // ========================================
    // GET ALL IMAGES
    // ========================================

    async getAll() {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT
                    rti.id,
                    rti.room_type_id,
                    rt.name AS room_type_name,
                    rt.hotel_id,
                    rti.image_url,
                    rti.is_thumbnail
                FROM room_type_images rti
                INNER JOIN room_types rt
                    ON rti.room_type_id = rt.id
                ORDER BY rti.id DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET IMAGES BY ROOM TYPE
    // ========================================

    async getByRoomTypeId(roomTypeId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input(
                'room_type_id',
                sql.BigInt,
                roomTypeId
            )
            .query(`
                SELECT
                    id,
                    room_type_id,
                    image_url,
                    is_thumbnail
                FROM room_type_images
                WHERE room_type_id = @room_type_id
                ORDER BY is_thumbnail DESC, id DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET BY ID
    // ========================================

    async getById(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    rti.id,
                    rti.room_type_id,
                    rt.name AS room_type_name,
                    rt.hotel_id,
                    rti.image_url,
                    rti.is_thumbnail
                FROM room_type_images rti
                INNER JOIN room_types rt
                    ON rti.room_type_id = rt.id
                WHERE rti.id = @id
            `);

        return result.recordset[0];
    },


    // ========================================
    // CREATE
    // ========================================

    async create(
        roomTypeId: number,
        imageUrl: string,
        isThumbnail: boolean
    ) {

        const pool = await getConnection();

        // Nếu ảnh mới là thumbnail
        // thì bỏ thumbnail của các ảnh khác
        if (isThumbnail) {

            await pool.request()
                .input(
                    'room_type_id',
                    sql.BigInt,
                    roomTypeId
                )
                .query(`
                    UPDATE room_type_images
                    SET is_thumbnail = 0
                    WHERE room_type_id = @room_type_id
                `);
        }

        const result = await pool.request()
            .input(
                'room_type_id',
                sql.BigInt,
                roomTypeId
            )
            .input(
                'image_url',
                sql.VarChar(255),
                imageUrl
            )
            .input(
                'is_thumbnail',
                sql.Bit,
                isThumbnail
            )
            .query(`
                INSERT INTO room_type_images
                (
                    room_type_id,
                    image_url,
                    is_thumbnail
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.room_type_id,
                    INSERTED.image_url,
                    INSERTED.is_thumbnail
                VALUES
                (
                    @room_type_id,
                    @image_url,
                    @is_thumbnail
                )
            `);

        return result.recordset[0];
    },


    // ========================================
    // UPDATE
    // ========================================

    async update(
        id: number,
        imageUrl: string,
        isThumbnail: boolean
    ) {

        const pool = await getConnection();

        // Lấy room_type_id của ảnh
        const image =
            await this.getById(id);

        if (!image) {
            return null;
        }

        // Nếu đặt ảnh này làm thumbnail
        // thì bỏ thumbnail cũ
        if (isThumbnail) {

            await pool.request()
                .input(
                    'room_type_id',
                    sql.BigInt,
                    image.room_type_id
                )
                .query(`
                    UPDATE room_type_images
                    SET is_thumbnail = 0
                    WHERE room_type_id = @room_type_id
                `);
        }

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input(
                'image_url',
                sql.VarChar(255),
                imageUrl
            )
            .input(
                'is_thumbnail',
                sql.Bit,
                isThumbnail
            )
            .query(`
                UPDATE room_type_images
                SET
                    image_url = @image_url,
                    is_thumbnail = @is_thumbnail
                OUTPUT
                    INSERTED.id,
                    INSERTED.room_type_id,
                    INSERTED.image_url,
                    INSERTED.is_thumbnail
                WHERE id = @id
            `);

        return result.recordset[0];
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM room_type_images
                WHERE id = @id
            `);

        return result.rowsAffected[0];
    }
};