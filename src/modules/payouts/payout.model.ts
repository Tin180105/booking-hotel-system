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


    // =========================
    // DELETE
    // =========================
    static async deletePayout(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM payouts
                OUTPUT DELETED.*
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }
}