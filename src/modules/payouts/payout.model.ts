import sql from 'mssql';
import { getConnection } from '../../config/database';

export class PayoutModel {

    // =========================
    // CREATE PAYOUT
    // =========================
static async createPayout(data: {
    hotel_id: number;
    payout_code: string;
}) {
    const pool = await getConnection();

    const result = await pool.request()
        .input(
            'HotelId',
            sql.BigInt,
            data.hotel_id
        )
        .input(
            'PayoutCode',
            sql.VarChar(30),
            data.payout_code
        )
        .execute('dbo.sp_CreatePayout');

    return result.recordset[0];
}

    // =========================
    // GET ALL
    // =========================
    static async getPayouts() {

        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                p.id,
                p.hotel_id,
                h.name AS hotel_name,
                p.payout_code,
                p.total_booking_amount,
                p.total_commission,
                p.payout_amount,
                p.status,
                p.payout_date,
                p.created_at
            FROM payouts p
            INNER JOIN hotels h
                ON p.hotel_id = h.id
            ORDER BY p.created_at DESC
        `);

        return result.recordset;
    }


    // =========================
    // GET BY ID
    // =========================
    static async getPayoutById(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    p.id,
                    p.hotel_id,
                    h.name AS hotel_name,
                    p.payout_code,
                    p.total_booking_amount,
                    p.total_commission,
                    p.payout_amount,
                    p.status,
                    p.payout_date,
                    p.created_at
                FROM payouts p
                INNER JOIN hotels h
                    ON p.hotel_id = h.id
                WHERE p.id = @id
            `);

        return result.recordset[0] || null;
    }

    // thêm vào trong class PayoutModel

    // =========================
    // GET BY HOTEL ID
    // =========================
    static async getByHotelId(hotelId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .query(`
                SELECT
                    p.id,
                    p.hotel_id,
                    h.name AS hotel_name,
                    p.payout_code,
                    p.total_booking_amount,
                    p.total_commission,
                    p.payout_amount,
                    p.status,
                    p.payout_date,
                    p.created_at
                FROM payouts p
                INNER JOIN hotels h
                    ON p.hotel_id = h.id
                WHERE p.hotel_id = @hotel_id
                ORDER BY p.created_at DESC
            `);

        return result.recordset;
    }

    // =========================
    // UPDATE
    // =========================
    static async updatePayout(
        id: number,
        data: {
            status?: string;
            payout_date?: string | null;
        }
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input(
                'status',
                sql.VarChar(30),
                data.status ?? null
            )
            .input(
                'payout_date',
                sql.DateTime2,
                data.payout_date
                    ? new Date(data.payout_date)
                    : null
            )
            .query(`
                UPDATE payouts
                SET
                    status =
                        COALESCE(@status, status),

                    payout_date =
                        COALESCE(
                            @payout_date,
                            payout_date
                        )
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }


    // ========================================
    // DELETE — PHIÊN BẢN CHƯA FIX
    // ========================================
static async deletePayout(id: number) {

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
        // ===== ĐỌC (LẦN DUY NHẤT) =====
        const first = await new sql.Request(transaction)
            .input('id', sql.BigInt, id)
            .query(`
                SELECT id, hotel_id, status, payout_amount
                FROM payouts
                WHERE id = @id
            `);

        if (first.recordset.length === 0) {
            await transaction.rollback();
            return null;
        }

        const payout = first.recordset[0];

        if (!['PENDING', 'PAID'].includes(payout.status)) {
            await transaction.rollback();
            throw new Error(
                `Không thể xóa payout đang ở trạng thái "${payout.status}"`
            );
        }

        // Bước kiểm tra ràng buộc dữ liệu liên quan (xử lý thật)
        await new sql.Request(transaction)
            .input('hotel_id', sql.BigInt, payout.hotel_id)
            .query(`
                SELECT COUNT(*) AS total
                FROM bookings b
                INNER JOIN payments p ON p.booking_id = b.id
                WHERE b.hotel_id = @hotel_id
                  AND p.payment_status = 'SUCCESS'
            `);

        // Khoảng dừng mô phỏng admin xem lại kết quả trước khi xác nhận
        await new Promise((resolve) => setTimeout(resolve, 8000));

        // KHÔNG ĐỌC LẠI TRẠNG THÁI — xóa thẳng dựa vào dữ liệu đọc từ đầu
        const result = await new sql.Request(transaction)
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM payouts
                OUTPUT DELETED.id, DELETED.hotel_id, DELETED.payout_code
                WHERE id = @id
            `);

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
}

static async confirmReceived(id: number) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.BigInt, id)
        .query(`
            UPDATE payouts
            SET status = 'CONFIRMED'
            OUTPUT INSERTED.*
            WHERE id = @id
              AND status = 'PAID'
        `);
    return result.recordset[0] || null;
}
}