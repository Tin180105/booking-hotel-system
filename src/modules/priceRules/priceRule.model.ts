import sql from 'mssql';
import { getConnection } from '../../config/database';

export class PriceRuleModel {

    // ==========================================
    // GET ALL PRICE RULES
    // ==========================================

    static async getAll() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                pr.id,
                pr.room_type_id,
                rt.name AS room_type_name,
                rt.hotel_id,
                h.name AS hotel_name,
                pr.rule_name,
                pr.start_date,
                pr.end_date,
                pr.days_of_week,
                pr.adjustment_type,
                pr.adjustment_value,
                pr.priority,
                pr.is_active
            FROM price_rules pr
            INNER JOIN room_types rt
                ON pr.room_type_id = rt.id
            INNER JOIN hotels h
                ON rt.hotel_id = h.id
            ORDER BY pr.priority DESC, pr.id DESC
        `);

        return result.recordset;
    }


    // ==========================================
    // GET PRICE RULE BY ID
    // ==========================================

    static async getById(id: number) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    pr.id,
                    pr.room_type_id,
                    rt.name AS room_type_name,
                    rt.hotel_id,
                    h.name AS hotel_name,
                    pr.rule_name,
                    pr.start_date,
                    pr.end_date,
                    pr.days_of_week,
                    pr.adjustment_type,
                    pr.adjustment_value,
                    pr.priority,
                    pr.is_active
                FROM price_rules pr
                INNER JOIN room_types rt
                    ON pr.room_type_id = rt.id
                INNER JOIN hotels h
                    ON rt.hotel_id = h.id
                WHERE pr.id = @id
            `);

        return result.recordset[0] || null;
    }


    // ==========================================
    // GET BY ROOM TYPE
    // ==========================================

    static async getByRoomType(roomTypeId: number) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'room_type_id',
                sql.BigInt,
                roomTypeId
            )
            .query(`
                SELECT
                    pr.id,
                    pr.room_type_id,
                    rt.name AS room_type_name,
                    pr.rule_name,
                    pr.start_date,
                    pr.end_date,
                    pr.days_of_week,
                    pr.adjustment_type,
                    pr.adjustment_value,
                    pr.priority,
                    pr.is_active
                FROM price_rules pr
                INNER JOIN room_types rt
                    ON pr.room_type_id = rt.id
                WHERE pr.room_type_id = @room_type_id
                ORDER BY pr.priority DESC, pr.id DESC
            `);

        return result.recordset;
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(data: {
        room_type_id: number;
        rule_name: string;
        start_date?: string | null;
        end_date?: string | null;
        days_of_week?: string | null;
        adjustment_type: string;
        adjustment_value: number;
        priority?: number;
        is_active?: boolean;
    }) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'room_type_id',
                sql.BigInt,
                data.room_type_id
            )
            .input(
                'rule_name',
                sql.NVarChar(100),
                data.rule_name
            )
            .input(
                'start_date',
                sql.Date,
                data.start_date || null
            )
            .input(
                'end_date',
                sql.Date,
                data.end_date || null
            )
            .input(
                'days_of_week',
                sql.VarChar(20),
                data.days_of_week || null
            )
            .input(
                'adjustment_type',
                sql.VarChar(20),
                data.adjustment_type
            )
            .input(
                'adjustment_value',
                sql.Decimal(12, 2),
                data.adjustment_value
            )
            .input(
                'priority',
                sql.Int,
                data.priority ?? 0
            )
            .input(
                'is_active',
                sql.Bit,
                data.is_active ?? true
            )
            .query(`
                INSERT INTO price_rules (
                    room_type_id,
                    rule_name,
                    start_date,
                    end_date,
                    days_of_week,
                    adjustment_type,
                    adjustment_value,
                    priority,
                    is_active
                )
                OUTPUT INSERTED.*
                VALUES (
                    @room_type_id,
                    @rule_name,
                    @start_date,
                    @end_date,
                    @days_of_week,
                    @adjustment_type,
                    @adjustment_value,
                    @priority,
                    @is_active
                )
            `);

        return result.recordset[0];
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        id: number,
        data: {
            room_type_id?: number;
            rule_name?: string;
            start_date?: string | null;
            end_date?: string | null;
            days_of_week?: string | null;
            adjustment_type?: string;
            adjustment_value?: number;
            priority?: number;
            is_active?: boolean;
        }
    ) {
        const pool = await getConnection();

        const request = pool
            .request()
            .input('id', sql.BigInt, id);

        const fields: string[] = [];

        if (data.room_type_id !== undefined) {
            request.input(
                'room_type_id',
                sql.BigInt,
                data.room_type_id
            );

            fields.push(
                'room_type_id = @room_type_id'
            );
        }

        if (data.rule_name !== undefined) {
            request.input(
                'rule_name',
                sql.NVarChar(100),
                data.rule_name
            );

            fields.push(
                'rule_name = @rule_name'
            );
        }

        if (data.start_date !== undefined) {
            request.input(
                'start_date',
                sql.Date,
                data.start_date
            );

            fields.push(
                'start_date = @start_date'
            );
        }

        if (data.end_date !== undefined) {
            request.input(
                'end_date',
                sql.Date,
                data.end_date
            );

            fields.push(
                'end_date = @end_date'
            );
        }

        if (data.days_of_week !== undefined) {
            request.input(
                'days_of_week',
                sql.VarChar(20),
                data.days_of_week
            );

            fields.push(
                'days_of_week = @days_of_week'
            );
        }

        if (data.adjustment_type !== undefined) {
            request.input(
                'adjustment_type',
                sql.VarChar(20),
                data.adjustment_type
            );

            fields.push(
                'adjustment_type = @adjustment_type'
            );
        }

        if (data.adjustment_value !== undefined) {
            request.input(
                'adjustment_value',
                sql.Decimal(12, 2),
                data.adjustment_value
            );

            fields.push(
                'adjustment_value = @adjustment_value'
            );
        }

        if (data.priority !== undefined) {
            request.input(
                'priority',
                sql.Int,
                data.priority
            );

            fields.push(
                'priority = @priority'
            );
        }

        if (data.is_active !== undefined) {
            request.input(
                'is_active',
                sql.Bit,
                data.is_active
            );

            fields.push(
                'is_active = @is_active'
            );
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const result = await request.query(`
            UPDATE price_rules
            SET ${fields.join(', ')}
            WHERE id = @id;

            SELECT *
            FROM price_rules
            WHERE id = @id;
        `);

        return result.recordset[0] || null;
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(id: number) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM price_rules
                WHERE id = @id
            `);

        return result.rowsAffected[0] > 0;
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    static async updateStatus(
        id: number,
        isActive: boolean
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .input(
                'is_active',
                sql.Bit,
                isActive
            )
            .query(`
                UPDATE price_rules
                SET is_active = @is_active
                WHERE id = @id;

                SELECT *
                FROM price_rules
                WHERE id = @id;
            `);

        return result.recordset[0] || null;
    }
}