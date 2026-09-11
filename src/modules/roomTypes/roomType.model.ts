import sql from 'mssql';
import { getConnection } from '../../config/database';

export const RoomTypeModel = {

    // ========================================
    // GET ROOM TYPE OVERVIEW
    // ========================================

    async getOverview() {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT
                    room_type_id,
                    hotel_id,
                    hotel_name,
                    room_type_name,
                    capacity,
                    total_rooms,
                    base_price,
                    description,
                    total_images
                FROM vw_RoomTypeOverview
                ORDER BY room_type_id DESC
            `);

        return result.recordset;
    },

    // ========================================
    // GET ALL ROOM TYPES
    // ========================================

    async getAll() {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT
                    rt.id,
                    rt.hotel_id,
                    h.name AS hotel_name,
                    rt.name,
                    rt.capacity,
                    rt.total_rooms,
                    rt.base_price,
                    rt.description,
                    COALESCE(
                        thumbnail.image_url,
                        fallback_thumbnail.image_url
                    ) AS thumbnail_url
                FROM room_types rt
                INNER JOIN hotels h
                    ON rt.hotel_id = h.id
                OUTER APPLY (
                    SELECT TOP 1
                        image_url
                    FROM room_type_images
                    WHERE room_type_id = rt.id
                    ORDER BY is_thumbnail DESC, id DESC
                ) AS thumbnail
                OUTER APPLY (
                    SELECT TOP 1
                        image_url
                    FROM room_type_images
                    ORDER BY is_thumbnail DESC, id DESC
                ) AS fallback_thumbnail
                ORDER BY rt.id DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET ROOM TYPES BY HOTEL
    // ========================================

    async getByHotelId(hotelId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .query(`
                SELECT
                    id,
                    hotel_id,
                    name,
                    capacity,
                    total_rooms,
                    base_price,
                    description,
                    COALESCE(
                        thumbnail.image_url,
                        fallback_thumbnail.image_url
                    ) AS thumbnail_url
                FROM room_types
                OUTER APPLY (
                    SELECT TOP 1
                        image_url
                    FROM room_type_images
                    WHERE room_type_id = room_types.id
                    ORDER BY is_thumbnail DESC, id DESC
                ) AS thumbnail
                OUTER APPLY (
                    SELECT TOP 1
                        image_url
                    FROM room_type_images
                    ORDER BY is_thumbnail DESC, id DESC
                ) AS fallback_thumbnail
                WHERE hotel_id = @hotel_id
                ORDER BY id DESC
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
                    rt.id,
                    rt.hotel_id,
                    h.name AS hotel_name,
                    rt.name,
                    rt.capacity,
                    rt.total_rooms,
                    rt.base_price,
                    rt.description
                FROM room_types rt
                INNER JOIN hotels h
                    ON rt.hotel_id = h.id
                WHERE rt.id = @id
            `);

        return result.recordset[0];
    },


    // ========================================
    // CREATE
    // ========================================

    async create(
        hotelId: number,
        name: string,
        capacity: number,
        totalRooms: number,
        basePrice: number,
        description?: string
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .input('name', sql.NVarChar(100), name)
            .input('capacity', sql.Int, capacity)
            .input('total_rooms', sql.Int, totalRooms)
            .input('base_price', sql.Decimal(12, 2), basePrice)
            .input(
                'description',
                sql.NVarChar(sql.MAX),
                description || null
            )
            .query(`
                INSERT INTO room_types
                (
                    hotel_id,
                    name,
                    capacity,
                    total_rooms,
                    base_price,
                    description
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.hotel_id,
                    INSERTED.name,
                    INSERTED.capacity,
                    INSERTED.total_rooms,
                    INSERTED.base_price,
                    INSERTED.description
                VALUES
                (
                    @hotel_id,
                    @name,
                    @capacity,
                    @total_rooms,
                    @base_price,
                    @description
                )
            `);

        return result.recordset[0];
    },


    // ========================================
    // UPDATE
    // ========================================

    async update(
        id: number,
        name: string,
        capacity: number,
        totalRooms: number,
        basePrice: number,
        description?: string
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('name', sql.NVarChar(100), name)
            .input('capacity', sql.Int, capacity)
            .input('total_rooms', sql.Int, totalRooms)
            .input('base_price', sql.Decimal(12, 2), basePrice)
            .input(
                'description',
                sql.NVarChar(sql.MAX),
                description || null
            )
            .query(`
                UPDATE room_types
                SET
                    name = @name,
                    capacity = @capacity,
                    total_rooms = @total_rooms,
                    base_price = @base_price,
                    description = @description
                OUTPUT
                    INSERTED.id,
                    INSERTED.hotel_id,
                    INSERTED.name,
                    INSERTED.capacity,
                    INSERTED.total_rooms,
                    INSERTED.base_price,
                    INSERTED.description
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
                DELETE FROM room_types
                WHERE id = @id
            `);

        return result.rowsAffected[0];
    },

    async getAvailability(
    id: number,
    checkIn: string,
    checkOut: string
) {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.BigInt, id)
        .input('check_in', sql.DateTime2, checkIn)
        .input('check_out', sql.DateTime2, checkOut)
        .query(`
            SELECT
                rt.id,
                rt.total_rooms,
                ISNULL((
                    SELECT SUM(br.quantity)
                    FROM booking_rooms br
                    INNER JOIN bookings b
                        ON b.id = br.booking_id
                    WHERE br.room_type_id = rt.id
                      AND br.expected_check_in < @check_out
                      AND br.expected_check_out > @check_in
                      AND b.status <> 'CANCELLED'
                ), 0) AS booked_quantity
            FROM room_types rt
            WHERE rt.id = @id
        `);

    const row = result.recordset[0];
    if (!row) return null;

    return {
        room_type_id: row.id,
        total_rooms: row.total_rooms,
        booked: row.booked_quantity,
        available: row.total_rooms - row.booked_quantity
    };
}
};