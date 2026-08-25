import sql from 'mssql';
import { getConnection } from '../../config/database';

export class WishlistModel {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                w.customer_id,
                c.full_name AS customer_name,
                c.email AS customer_email,

                w.hotel_id,
                h.name AS hotel_name,
                h.city,
                h.address,
                h.star_rating,
                h.status,

                w.created_at
            FROM wishlists w
            INNER JOIN customers c
                ON w.customer_id = c.id
            INNER JOIN hotels h
                ON w.hotel_id = h.id
            ORDER BY w.created_at DESC
        `);

        return result.recordset;
    }


    // ==========================================
    // GET BY CUSTOMER
    // ==========================================

    static async getByCustomer(
        customerId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'customer_id',
                sql.BigInt,
                customerId
            )
            .query(`
                SELECT
                    w.customer_id,
                    c.full_name AS customer_name,

                    w.hotel_id,
                    h.name AS hotel_name,
                    h.city,
                    h.address,
                    h.star_rating,
                    h.status,

                    w.created_at
                FROM wishlists w
                INNER JOIN customers c
                    ON w.customer_id = c.id
                INNER JOIN hotels h
                    ON w.hotel_id = h.id
                WHERE w.customer_id = @customer_id
                ORDER BY w.created_at DESC
            `);

        return result.recordset;
    }


    // ==========================================
    // GET BY HOTEL
    // ==========================================

    static async getByHotel(
        hotelId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'hotel_id',
                sql.BigInt,
                hotelId
            )
            .query(`
                SELECT
                    w.customer_id,
                    c.full_name AS customer_name,
                    c.email AS customer_email,

                    w.hotel_id,
                    h.name AS hotel_name,

                    w.created_at
                FROM wishlists w
                INNER JOIN customers c
                    ON w.customer_id = c.id
                INNER JOIN hotels h
                    ON w.hotel_id = h.id
                WHERE w.hotel_id = @hotel_id
                ORDER BY w.created_at DESC
            `);

        return result.recordset;
    }


    // ==========================================
    // GET ONE
    // ==========================================

    static async getOne(
        customerId: number,
        hotelId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'customer_id',
                sql.BigInt,
                customerId
            )
            .input(
                'hotel_id',
                sql.BigInt,
                hotelId
            )
            .query(`
                SELECT
                    w.customer_id,
                    c.full_name AS customer_name,

                    w.hotel_id,
                    h.name AS hotel_name,
                    h.city,
                    h.address,
                    h.star_rating,

                    w.created_at
                FROM wishlists w
                INNER JOIN customers c
                    ON w.customer_id = c.id
                INNER JOIN hotels h
                    ON w.hotel_id = h.id
                WHERE
                    w.customer_id = @customer_id
                    AND w.hotel_id = @hotel_id
            `);

        return result.recordset[0] || null;
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(
        customerId: number,
        hotelId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'customer_id',
                sql.BigInt,
                customerId
            )
            .input(
                'hotel_id',
                sql.BigInt,
                hotelId
            )
            .query(`
                INSERT INTO wishlists (
                    customer_id,
                    hotel_id
                )
                OUTPUT INSERTED.*
                VALUES (
                    @customer_id,
                    @hotel_id
                )
            `);

        return result.recordset[0];
    }


    // ==========================================
    // UPDATE
    // Đổi hotel trong wishlist
    // ==========================================

    static async update(
        customerId: number,
        oldHotelId: number,
        newHotelId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'customer_id',
                sql.BigInt,
                customerId
            )
            .input(
                'old_hotel_id',
                sql.BigInt,
                oldHotelId
            )
            .input(
                'new_hotel_id',
                sql.BigInt,
                newHotelId
            )
            .query(`
                UPDATE wishlists
                SET hotel_id = @new_hotel_id
                WHERE
                    customer_id = @customer_id
                    AND hotel_id = @old_hotel_id;

                SELECT
                    w.customer_id,
                    c.full_name AS customer_name,
                    w.hotel_id,
                    h.name AS hotel_name,
                    h.city,
                    h.address,
                    h.star_rating,
                    w.created_at
                FROM wishlists w
                INNER JOIN customers c
                    ON w.customer_id = c.id
                INNER JOIN hotels h
                    ON w.hotel_id = h.id
                WHERE
                    w.customer_id = @customer_id
                    AND w.hotel_id = @new_hotel_id;
            `);

        return result.recordset[0] || null;
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(
        customerId: number,
        hotelId: number
    ) {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input(
                'customer_id',
                sql.BigInt,
                customerId
            )
            .input(
                'hotel_id',
                sql.BigInt,
                hotelId
            )
            .query(`
                DELETE FROM wishlists
                WHERE
                    customer_id = @customer_id
                    AND hotel_id = @hotel_id
            `);

        return result.rowsAffected[0] > 0;
    }
}