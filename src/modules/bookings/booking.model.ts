import sql from 'mssql';
import { getConnection } from '../../config/database';
import { ALLOWED_STATUS } from './booking.service';

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

    // 🧪 DEMO LOST UPDATE — test bằng cách bấm thật trên giao diện Admin
    // (dropdown "Trạng thái" ở /admin/bookings), mở 2 tab cùng đổi
    // trạng thái 1 booking gần như đồng thời.
    //
    // Bản đang BẬT dưới đây = LỖI: đọc status hiện tại, "suy nghĩ" 6s
    // (giữ nguyên độ trễ y như code cũ), rồi GHI ĐÈ MÙ theo id — không
    // khóa, không kiểm tra lại status cũ còn đúng không.
    //
    // -> Quay xong phần lỗi: COMMENT khối này lại, UNCOMMENT khối
    // "BẢN FIX" ngay bên dưới rồi build lại để quay phần fix. Cả 2 bản
    // dùng chung 1 chỗ gọi ở booking.service.ts, không phải sửa gì ở đó.
    async updateStatus(id: number, status: string) {
        const pool = await getConnection();

        const before = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`SELECT id, status 
                FROM bookings 
                WHERE id = @id`
            );

        console.log(`[DEMO][BUG] Booking #${id}: đọc status = ${before.recordset[0]?.status}, đang "xử lý" 6s...`);
        await new Promise((resolve) => setTimeout(resolve, 6000));
        console.log(`[DEMO][BUG] Booking #${id}: hết 6s, ghi status = ${status} (không kiểm tra lại status cũ)`);

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('status', sql.VarChar, status)
            .query(`
                UPDATE bookings
                SET status = @status, updated_at = GETDATE()
                OUTPUT INSERTED.id, INSERTED.status, INSERTED.updated_at
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    },

    // -----------------------------------------------------------------
    // 🔒 BẢN FIX — chỉ thêm 1 khóa so với bản lỗi ở trên: bọc trong
    // transaction, đọc bằng WITH (UPDLOCK, ROWLOCK) để khóa luôn dòng
    // này, GIỮ khóa xuyên suốt 6s "suy nghĩ" rồi mới UPDATE + COMMIT
    // (nhả khóa). Tab nào đọc sau sẽ bị TREO tại câu SELECT cho tới khi
    // tab đầu COMMIT xong, nên không còn 2 tab cùng đọc 1 status cũ rồi
    // cùng ghi đè lên nhau nữa.
    //
    // Muốn quay phần fix: comment khối "async updateStatus" phía trên,
    // rồi uncomment khối bên dưới (bỏ dấu // ở đầu mỗi dòng).
    // -----------------------------------------------------------------
    // async updateStatus(id: number, status: string) {
    //     const pool = await getConnection();
    //     const transaction = new sql.Transaction(pool);
    //     await transaction.begin();
    //
    //     try {
    //         const before = await new sql.Request(transaction)
    //             .input('id', sql.BigInt, id)
    //             .query(`
    //                 SELECT id, status
    //                 FROM bookings WITH (UPDLOCK, ROWLOCK)
    //                 WHERE id = @id
    //             `);
    //
    //         console.log(`[DEMO][FIX] Booking #${id}: đã khóa dòng, status = ${before.recordset[0]?.status}, đang "xử lý" 6s...`);
    //         await new Promise((resolve) => setTimeout(resolve, 6000));
    //         console.log(`[DEMO][FIX] Booking #${id}: hết 6s, ghi status = ${status} rồi COMMIT (nhả khóa)`);
    //
    //         const result = await new sql.Request(transaction)
    //             .input('id', sql.BigInt, id)
    //             .input('status', sql.VarChar, status)
    //             .query(`
    //                 UPDATE bookings
    //                 SET status = @status, updated_at = GETDATE()
    //                 OUTPUT INSERTED.id, INSERTED.status, INSERTED.updated_at
    //                 WHERE id = @id
    //             `);
    //
    //         await transaction.commit();
    //         return result.recordset[0] || null;
    //     } catch (error) {
    //         await transaction.rollback();
    //         throw error;
    //     }
    // },

    // ========================================
    // DEMO DEADLOCK: hủy booking + hủy payment trong 1 transaction
    // ========================================
    async cancelBookingAndVoidPayment(
        id: number,
        expectedOldStatus?: string
    ) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
        await new sql.Request(transaction)
            .input('booking_id', sql.BigInt, id)
            .query(`
                UPDATE payments
                SET payment_status = 'CANCELLED'
                WHERE booking_id = @booking_id
                AND payment_status = 'PENDING'
            `);

        console.log(`[DEMO] Đã khóa payment của booking #${id}, đang chờ cổng thanh toán xác nhận hủy (6s)...`);
        await new Promise((resolve) => setTimeout(resolve, 6000));
        console.log(`[DEMO] Hết 6s, tiến hành cập nhật trạng thái booking #${id} = CANCELLED`);

        const result = await new sql.Request(transaction)
            .input('id', sql.BigInt, id)
            .input('status', sql.VarChar, 'CANCELLED')
            .input('old_status', sql.VarChar, expectedOldStatus ?? null)
            .query(`
                UPDATE bookings
                SET status = @status, updated_at = GETDATE()
                OUTPUT INSERTED.id, INSERTED.status, INSERTED.updated_at
                WHERE id = @id
                AND (@old_status IS NULL OR status = @old_status)
            `);

        // const bookingResult = await new sql.Request(transaction)
        //     .input('id', sql.BigInt, id)
        //     .input('old_status', sql.VarChar, expectedOldStatus ?? null)
        //     .query(`
        //         SELECT id, status
        //         FROM bookings WITH (UPDLOCK, ROWLOCK)
        //         WHERE id = @id
        //           AND (@old_status IS NULL OR status = @old_status)
        //     `);

        // if (bookingResult.recordset.length === 0) {
        //     await transaction.rollback();
        //     return null;
        // }
        // console.log(`[DEMO] Đã khóa booking #${id}, đang chờ cổng thanh toán xác nhận hủy (6s)...`);
        // await new Promise((resolve) => setTimeout(resolve, 6000));
        // console.log(`[DEMO] Hết 6s, tiến hành hủy payment + cập nhật booking #${id} = CANCELLED`);
        // await new sql.Request(transaction)
        //     .input('booking_id', sql.BigInt, id)
        //     .query(`
        //         UPDATE payments
        //         SET payment_status = 'CANCELLED'
        //         WHERE booking_id = @booking_id
        //           AND payment_status = 'PENDING'
        //     `);
        // const result = await new sql.Request(transaction)
        //     .input('id', sql.BigInt, id)
        //     .input('status', sql.VarChar, 'CANCELLED')
        //     .query(`
        //         UPDATE bookings
        //         SET status = @status, updated_at = GETDATE()
        //         OUTPUT INSERTED.id, INSERTED.status, INSERTED.updated_at
        //         WHERE id = @id
        //     `);

            await transaction.commit();

            return result.recordset[0] || null;

        } catch (error) {
            try {
                await transaction.rollback();
            } catch {
                // đã rollback hoặc chưa begin
            }
            throw error;
        }
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
    },

    async getByCustomerId(customerId: number) {
  const pool = await getConnection();

  const result = await pool.request()
    .input('customer_id', sql.BigInt, customerId)
    .query(`
      SELECT DISTINCT
        h.id AS hotel_id,
        h.name AS hotel_name,
        h.city,
        b.id AS booking_id,
        b.booking_code,
        b.status
      FROM bookings b
      INNER JOIN hotels h ON b.hotel_id = h.id
      WHERE b.customer_id = @customer_id
      ORDER BY h.name
    `);

  return result.recordset;
}
};