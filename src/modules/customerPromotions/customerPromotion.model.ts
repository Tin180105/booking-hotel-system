import sql from 'mssql';
import { getConnection } from '../../config/database';

export class CustomerPromotionModel {
    static async getByCustomer(customerId: number) {
        const pool = await getConnection();

        const result = await pool.request()
            .input('customer_id', sql.BigInt, customerId)
            .query(`
                SELECT promotion_id, saved_at
                FROM customer_promotions
                WHERE customer_id = @customer_id
                ORDER BY saved_at DESC
            `);

        return result.recordset;
    }

    static async save(customerId: number, promotionId: number) {
        const pool = await getConnection();

        const result = await pool.request()
            .input('customer_id', sql.BigInt, customerId)
            .input('promotion_id', sql.BigInt, promotionId)
            .query(`
                INSERT INTO customer_promotions (customer_id, promotion_id)
                OUTPUT INSERTED.customer_id, INSERTED.promotion_id, INSERTED.saved_at
                VALUES (@customer_id, @promotion_id)
            `);

        return result.recordset[0];
    }
}