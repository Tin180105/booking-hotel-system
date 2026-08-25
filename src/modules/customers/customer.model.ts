import sql from 'mssql';
import { getConnection } from '../../config/database';

export class CustomerModel {

    // GET ALL
    static async getAll() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                id,
                full_name,
                phone,
                email,
                password_hash,
                created_at
            FROM customers
            ORDER BY id DESC
        `);

        return result.recordset;
    }


    // GET BY ID
    static async getById(id: number) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    id,
                    full_name,
                    phone,
                    email,
                    password_hash,
                    created_at
                FROM customers
                WHERE id = @id
            `);

        return result.recordset[0] || null;
    }


    // GET BY EMAIL
    static async getByEmail(email: string) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('email', sql.VarChar(100), email)
            .query(`
                SELECT
                    id,
                    full_name,
                    phone,
                    email,
                    password_hash,
                    created_at
                FROM customers
                WHERE email = @email
            `);

        return result.recordset[0] || null;
    }


    // CREATE
    static async create(data: {
        full_name: string;
        phone: string;
        email: string;
        password_hash: string;
    }) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'full_name',
                sql.NVarChar(100),
                data.full_name
            )
            .input(
                'phone',
                sql.VarChar(20),
                data.phone
            )
            .input(
                'email',
                sql.VarChar(100),
                data.email
            )
            .input(
                'password_hash',
                sql.VarChar(255),
                data.password_hash
            )
            .query(`
                INSERT INTO customers (
                    full_name,
                    phone,
                    email,
                    password_hash
                )
                OUTPUT INSERTED.*
                VALUES (
                    @full_name,
                    @phone,
                    @email,
                    @password_hash
                )
            `);

        return result.recordset[0];
    }


    // UPDATE
    static async update(
        id: number,
        data: {
            full_name?: string;
            phone?: string;
            email?: string;
            password_hash?: string;
        }
    ) {
        const pool = await getConnection();

        const request = pool
            .request()
            .input('id', sql.BigInt, id);

        const fields: string[] = [];

        if (data.full_name !== undefined) {
            request.input(
                'full_name',
                sql.NVarChar(100),
                data.full_name
            );

            fields.push(
                'full_name = @full_name'
            );
        }

        if (data.phone !== undefined) {
            request.input(
                'phone',
                sql.VarChar(20),
                data.phone
            );

            fields.push(
                'phone = @phone'
            );
        }

        if (data.email !== undefined) {
            request.input(
                'email',
                sql.VarChar(100),
                data.email
            );

            fields.push(
                'email = @email'
            );
        }

        if (data.password_hash !== undefined) {
            request.input(
                'password_hash',
                sql.VarChar(255),
                data.password_hash
            );

            fields.push(
                'password_hash = @password_hash'
            );
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const result = await request.query(`
            UPDATE customers
            SET ${fields.join(', ')}
            WHERE id = @id;

            SELECT
                id,
                full_name,
                phone,
                email,
                password_hash,
                created_at
            FROM customers
            WHERE id = @id;
        `);

        return result.recordset[0] || null;
    }


    // DELETE
    static async delete(id: number) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM customers
                WHERE id = @id
            `);

        return result.rowsAffected[0] > 0;
    }
}