import sql from 'mssql';
import { getConnection } from '../../config/database';

export interface Promotion {
    id: number;
    code: string;
    discount_type: string;
    discount_value: number;
    max_discount: number | null;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
}

export interface CreatePromotionDTO {
    code: string;
    discount_type: string;
    discount_value: number;
    max_discount?: number | null;
    start_date: Date | string;
    end_date: Date | string;
    is_active?: boolean;
}

export interface UpdatePromotionDTO {
    code: string;
    discount_type: string;
    discount_value: number;
    max_discount?: number | null;
    start_date: Date | string;
    end_date: Date | string;
    is_active: boolean;
}

export class PromotionModel {

    // =========================
    // GET ALL
    // =========================
    static async getAll(): Promise<Promotion[]> {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                id,
                code,
                discount_type,
                discount_value,
                max_discount,
                start_date,
                end_date,
                is_active
            FROM promotions
            ORDER BY id DESC
        `);

        return result.recordset;
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(id: number): Promise<Promotion | null> {
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    id,
                    code,
                    discount_type,
                    discount_value,
                    max_discount,
                    start_date,
                    end_date,
                    is_active
                FROM promotions
                WHERE id = @id
            `);

        return result.recordset.length > 0
            ? result.recordset[0]
            : null;
    }

    // =========================
    // CREATE
    // =========================
    static async create(data: CreatePromotionDTO): Promise<Promotion> {
        const pool = await getConnection();

        const result = await pool.request()
            .input('code', sql.VarChar(30), data.code)
            .input('discount_type', sql.VarChar(20), data.discount_type)
            .input('discount_value', sql.Decimal(12, 2), data.discount_value)
            .input(
                'max_discount',
                sql.Decimal(12, 2),
                data.max_discount ?? null
            )
            .input('start_date', sql.DateTime2, data.start_date)
            .input('end_date', sql.DateTime2, data.end_date)
            .input('is_active', sql.Bit, data.is_active ?? true)
            .query(`
                INSERT INTO promotions (
                    code,
                    discount_type,
                    discount_value,
                    max_discount,
                    start_date,
                    end_date,
                    is_active
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.code,
                    INSERTED.discount_type,
                    INSERTED.discount_value,
                    INSERTED.max_discount,
                    INSERTED.start_date,
                    INSERTED.end_date,
                    INSERTED.is_active
                VALUES (
                    @code,
                    @discount_type,
                    @discount_value,
                    @max_discount,
                    @start_date,
                    @end_date,
                    @is_active
                )
            `);

        return result.recordset[0];
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        id: number,
        data: UpdatePromotionDTO
    ): Promise<Promotion | null> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('code', sql.VarChar(30), data.code)
            .input('discount_type', sql.VarChar(20), data.discount_type)
            .input('discount_value', sql.Decimal(12, 2), data.discount_value)
            .input(
                'max_discount',
                sql.Decimal(12, 2),
                data.max_discount ?? null
            )
            .input('start_date', sql.DateTime2, data.start_date)
            .input('end_date', sql.DateTime2, data.end_date)
            .input('is_active', sql.Bit, data.is_active)
            .query(`
                UPDATE promotions
                SET
                    code = @code,
                    discount_type = @discount_type,
                    discount_value = @discount_value,
                    max_discount = @max_discount,
                    start_date = @start_date,
                    end_date = @end_date,
                    is_active = @is_active
                OUTPUT
                    INSERTED.id,
                    INSERTED.code,
                    INSERTED.discount_type,
                    INSERTED.discount_value,
                    INSERTED.max_discount,
                    INSERTED.start_date,
                    INSERTED.end_date,
                    INSERTED.is_active
                WHERE id = @id
            `);

        return result.recordset.length > 0
            ? result.recordset[0]
            : null;
    }

    // =========================
    // DELETE
    // =========================
    static async delete(id: number): Promise<boolean> {
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM promotions
                WHERE id = @id
            `);

        return result.rowsAffected[0] > 0;
    }
}