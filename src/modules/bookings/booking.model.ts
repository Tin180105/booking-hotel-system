import sql from 'mssql';
import { getConnection } from '../../config/database';

export interface Booking {
    id: number;
    hotel_id: number;
    customer_id: number;
    promotion_id: number | null;
    booking_code: string;
    status: string;
    total_amount: number;
    commission_amount: number;
    final_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateBookingDTO {
    hotel_id: number;
    customer_id: number;
    room_type_id: number;
    quantity: number;
    check_in: Date | string;
    check_out: Date | string;
    promotion_id?: number | null;
}

export interface CreateBookingResult {
    booking_id: number;
    booking_code: string;
    hotel_id: number;
    customer_id: number;
    status: string;
    total_amount: number;
    final_amount: number;
    room_type_id: number;
    quantity: number;
    total_room_price: number;
    expected_check_in: Date;
    expected_check_out: Date;
}

export interface UpdateBookingDTO {
    hotel_id: number;
    customer_id: number;
    promotion_id?: number | null;
    booking_code: string;
    status: string;
    total_amount: number;
    commission_amount: number;
    final_amount: number;
}

export const BookingModel = {

    // ========================================
    // GET ALL BOOKINGS (kèm tên hotel/customer)
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
    // GET OVERVIEW (từ VIEW vw_BookingOverview)
    // ========================================

    async getOverview(): Promise<any[]> {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT * FROM vw_BookingOverview
            ORDER BY booking_created_at DESC
        `);

        return result.recordset;
    },


    // ========================================
    // GET BOOKINGS BY HOTEL (dùng cho role hotel)
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
    // CREATE (gọi sp_CreateBooking — tự tính giá,
    // áp price_rule, promotion, trigger check overlap)
    // ========================================

    async create(
        data: CreateBookingDTO
    ): Promise<CreateBookingResult> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('HotelId', sql.BigInt, data.hotel_id)
            .input('CustomerId', sql.BigInt, data.customer_id)
            .input('RoomTypeId', sql.BigInt, data.room_type_id)
            .input('Quantity', sql.Int, data.quantity)
            .input('CheckIn', sql.DateTime2, data.check_in)
            .input('CheckOut', sql.DateTime2, data.check_out)
            .input(
                'PromotionId',
                sql.BigInt,
                data.promotion_id ?? null
            )
            .execute('dbo.sp_CreateBooking');

        return result.recordset[0];
    },


    // ========================================
    // UPDATE (sửa toàn bộ thông tin booking)
    // ========================================

    async update(
        id: number,
        data: UpdateBookingDTO
    ): Promise<Booking | null> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('hotel_id', sql.BigInt, data.hotel_id)
            .input('customer_id', sql.BigInt, data.customer_id)
            .input(
                'promotion_id',
                sql.BigInt,
                data.promotion_id ?? null
            )
            .input(
                'booking_code',
                sql.VarChar(30),
                data.booking_code
            )
            .input(
                'status',
                sql.VarChar(30),
                data.status
            )
            .input(
                'total_amount',
                sql.Decimal(12, 2),
                data.total_amount
            )
            .input(
                'commission_amount',
                sql.Decimal(12, 2),
                data.commission_amount
            )
            .input(
                'final_amount',
                sql.Decimal(12, 2),
                data.final_amount
            )
            .query(`
                UPDATE bookings
                SET
                    hotel_id = @hotel_id,
                    customer_id = @customer_id,
                    promotion_id = @promotion_id,
                    booking_code = @booking_code,
                    status = @status,
                    total_amount = @total_amount,
                    commission_amount = @commission_amount,
                    final_amount = @final_amount,
                    updated_at = GETDATE()
                OUTPUT
                    INSERTED.id,
                    INSERTED.hotel_id,
                    INSERTED.customer_id,
                    INSERTED.promotion_id,
                    INSERTED.booking_code,
                    INSERTED.status,
                    INSERTED.total_amount,
                    INSERTED.commission_amount,
                    INSERTED.final_amount,
                    INSERTED.created_at,
                    INSERTED.updated_at
                WHERE id = @id
            `);

        return result.recordset.length > 0
            ? result.recordset[0]
            : null;
    },


    // ========================================
    // UPDATE STATUS (chỉ đổi trạng thái — nhanh gọn)
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
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(id: number): Promise<boolean> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM bookings
                WHERE id = @id
            `);

        return result.rowsAffected[0] > 0;
    }
};