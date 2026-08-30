import sql from 'mssql';
import { getConnection } from '../../config/database';

export const BookingModel = {

    // ========================================
    // GET ALL BOOKINGS
    // ========================================

    async getAll() {

        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                b.id,
                b.booking_code,
                b.status,
                b.total_amount,
                b.commission_amount,
                b.final_amount,
                b.created_at,
                h.id AS hotel_id,
                h.name AS hotel_name,
                c.id AS customer_id,
                c.full_name AS customer_name,
                c.email AS customer_email,
                c.phone AS customer_phone
            FROM bookings b
            INNER JOIN hotels h ON b.hotel_id = h.id
            INNER JOIN customers c ON b.customer_id = c.id
            ORDER BY b.created_at DESC
        `);

        return result.recordset;
    },


    // ========================================
    // GET BOOKINGS BY HOTEL (dùng cho role hotel sau này)
    // ========================================

    async getByHotelId(hotelId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .query(`
                SELECT
                    b.id,
                    b.booking_code,
                    b.status,
                    b.total_amount,
                    b.commission_amount,
                    b.final_amount,
                    b.created_at,
                    c.id AS customer_id,
                    c.full_name AS customer_name,
                    c.email AS customer_email,
                    c.phone AS customer_phone
                FROM bookings b
                INNER JOIN customers c ON b.customer_id = c.id
                WHERE b.hotel_id = @hotel_id
                ORDER BY b.created_at DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET BY ID (kèm chi tiết phòng đã đặt)
    // ========================================

    async getById(id: number) {

        const pool = await getConnection();

        const bookingResult = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    b.id,
                    b.booking_code,
                    b.status,
                    b.total_amount,
                    b.commission_amount,
                    b.final_amount,
                    b.created_at,
                    b.updated_at,
                    h.id AS hotel_id,
                    h.name AS hotel_name,
                    c.id AS customer_id,
                    c.full_name AS customer_name,
                    c.email AS customer_email,
                    c.phone AS customer_phone
                FROM bookings b
                INNER JOIN hotels h ON b.hotel_id = h.id
                INNER JOIN customers c ON b.customer_id = c.id
                WHERE b.id = @id
            `);

        const booking = bookingResult.recordset[0];

        if (!booking) {
            return null;
        }

        const roomsResult = await pool.request()
            .input('booking_id', sql.BigInt, id)
            .query(`
                SELECT
                    br.id,
                    br.room_type_id,
                    rt.name AS room_type_name,
                    br.quantity,
                    br.total_room_price,
                    br.expected_check_in,
                    br.expected_check_out
                FROM booking_rooms br
                INNER JOIN room_types rt ON br.room_type_id = rt.id
                WHERE br.booking_id = @booking_id
            `);

        return {
            ...booking,
            rooms: roomsResult.recordset
        };
    },


    // ========================================
    // UPDATE STATUS
    // ========================================

    async updateStatus(id: number, status: string) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('status', sql.VarChar, status)
            .query(`
                UPDATE bookings
                SET
                    status = @status,
                    updated_at = GETDATE()
                OUTPUT
                    INSERTED.id,
                    INSERTED.status,
                    INSERTED.updated_at
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }
};