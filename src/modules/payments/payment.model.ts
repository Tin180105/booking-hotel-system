import sql from 'mssql';
import { getConnection } from '../../config/database';

export class PaymentModel {

    // CREATE PAYMENT
    static async createPayment(data: {
        booking_id: number;
        payment_method: string;
        transaction_code?: string | null;
        amount: number;
    }) {
        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // =========================
            // 1. Lấy thông tin booking
            // =========================
            const bookingResult = await new sql.Request(transaction)
                .input('booking_id', sql.BigInt, data.booking_id)
                .query(`
                    SELECT
                        id,
                        status,
                        final_amount
                    FROM bookings
                    WHERE id = @booking_id
                `);

            if (bookingResult.recordset.length === 0) {
                throw new Error('Booking không tồn tại');
            }

            const booking = bookingResult.recordset[0];

            // =========================
            // 2. Kiểm tra booking
            // =========================
    
            if (booking.status === 'CONFIRMED') {
                throw new Error('Booking đã được thanh toán');
            }

            // =========================
            // 3. So sánh số tiền
            // =========================
            const finalAmount = Number(booking.final_amount);
            const paymentAmount = Number(data.amount);

            let paymentStatus: string;

            if (paymentAmount === finalAmount) {
                paymentStatus = 'SUCCESS';
            } else {
                paymentStatus = 'FAILED';
            }

            // =========================
            // 4. INSERT PAYMENT
            // =========================
            const paymentResult = await new sql.Request(transaction)
                .input(
                    'booking_id',
                    sql.BigInt,
                    data.booking_id
                )
                .input(
                    'payment_method',
                    sql.VarChar(30),
                    data.payment_method
                )
                .input(
                    'transaction_code',
                    sql.VarChar(100),
                    data.transaction_code ?? null
                )
                .input(
                    'amount',
                    sql.Decimal(12, 2),
                    paymentAmount
                )
                .input(
                    'payment_status',
                    sql.VarChar(30),
                    paymentStatus
                )
                .query(`
                    INSERT INTO payments
                    (
                        booking_id,
                        payment_method,
                        transaction_code,
                        amount,
                        payment_status,
                        paid_at
                    )
                    OUTPUT INSERTED.*
                    VALUES
                    (
                        @booking_id,
                        @payment_method,
                        @transaction_code,
                        @amount,
                        @payment_status,
                        CASE
                            WHEN @payment_status = 'SUCCESS'
                            THEN GETDATE()
                            ELSE NULL
                        END
                    )
                `);

            const payment = paymentResult.recordset[0];

            // =========================
            // 5. Nếu SUCCESS
            // → Booking CONFIRMED
            // =========================
            if (paymentStatus === 'SUCCESS') {

                await new sql.Request(transaction)
                    .input(
                        'booking_id',
                        sql.BigInt,
                        data.booking_id
                    )
                    .query(`
                        UPDATE bookings
                        SET
                            status = 'CONFIRMED',
                            updated_at = GETDATE()
                        WHERE id = @booking_id
                    `);
            }

            await transaction.commit();

            return payment;

        } catch (error) {

            try {
                await transaction.rollback();
            } catch {
                // transaction đã rollback hoặc chưa bắt đầu
            }

            throw error;
        }
    }


    // GET ALL PAYMENTS
    static async getPayments() {

        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                p.id,
                p.booking_id,
                b.booking_code,
                b.status AS booking_status,
                p.payment_method,
                p.transaction_code,
                p.amount,
                p.payment_status,
                p.paid_at,
                p.created_at
            FROM payments p
            INNER JOIN bookings b
                ON p.booking_id = b.id
            ORDER BY p.created_at DESC
        `);

        return result.recordset;
    }


    // GET PAYMENT BY ID
    static async getPaymentById(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    p.id,
                    p.booking_id,
                    b.booking_code,
                    b.status AS booking_status,
                    p.payment_method,
                    p.transaction_code,
                    p.amount,
                    p.payment_status,
                    p.paid_at,
                    p.created_at
                FROM payments p
                INNER JOIN bookings b
                    ON p.booking_id = b.id
                WHERE p.id = @id
            `);

        return result.recordset[0] || null;
    }


    // UPDATE PAYMENT
    static async updatePayment(
        id: number,
        data: {
            payment_method?: string;
            transaction_code?: string | null;
        }
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input(
                'payment_method',
                sql.VarChar(30),
                data.payment_method ?? null
            )
            .input(
                'transaction_code',
                sql.VarChar(100),
                data.transaction_code ?? null
            )
            .query(`
                UPDATE payments
                SET
                    payment_method =
                        CASE
                            WHEN @payment_method IS NULL
                            THEN payment_method
                            ELSE @payment_method
                        END,

                    transaction_code =
                        CASE
                            WHEN @transaction_code IS NULL
                            THEN transaction_code
                            ELSE @transaction_code
                        END
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }


    // DELETE PAYMENT
    static async deletePayment(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM payments
                OUTPUT DELETED.*
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }
}