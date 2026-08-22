import sql from 'mssql';
import { getConnection } from '../../config/database';

export const RoomTypeModel = {

    // ========================================
    // GET ALL ROOM TYPES
    // ========================================

    async getAll() {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT
                    rt.id,
                    rt.hotel_id,
                    h.name AS hotel_name,
                    rt.name,
                    rt.capacity,
                    rt.total_rooms,
                    rt.base_price,
                    rt.description
                FROM room_types rt
                INNER JOIN hotels h
                    ON rt.hotel_id = h.id
                ORDER BY rt.id DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET ROOM TYPES BY HOTEL
    // ========================================

    async getByHotelId(hotelId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .query(`
                SELECT
                    id,
                    hotel_id,
                    name,
                    capacity,
                    total_rooms,
                    base_price,
                    description
                FROM room_types
                WHERE hotel_id = @hotel_id
                ORDER BY id DESC
            `);

        return result.recordset;
    },


    // ========================================
    // GET BY ID
    // ========================================

    async getById(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    rt.id,
                    rt.hotel_id,
                    h.name AS hotel_name,
                    rt.name,
                    rt.capacity,
                    rt.total_rooms,
                    rt.base_price,
                    rt.description
                FROM room_types rt
                INNER JOIN hotels h
                    ON rt.hotel_id = h.id
                WHERE rt.id = @id
            `);

        return result.recordset[0];
    },


    // ========================================
    // CREATE
    // ========================================

    async create(
        hotelId: number,
        name: string,
        capacity: number,
        totalRooms: number,
        basePrice: number,
        description?: string
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('hotel_id', sql.BigInt, hotelId)
            .input('name', sql.NVarChar(100), name)
            .input('capacity', sql.Int, capacity)
            .input('total_rooms', sql.Int, totalRooms)
            .input('base_price', sql.Decimal(12, 2), basePrice)
            .input(
                'description',
                sql.NVarChar(sql.MAX),
                description || null
            )
            .query(`
                INSERT INTO room_types
                (
                    hotel_id,
                    name,
                    capacity,
                    total_rooms,
                    base_price,
                    description
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.hotel_id,
                    INSERTED.name,
                    INSERTED.capacity,
                    INSERTED.total_rooms,
                    INSERTED.base_price,
                    INSERTED.description
                VALUES
                (
                    @hotel_id,
                    @name,
                    @capacity,
                    @total_rooms,
                    @base_price,
                    @description
                )
            `);

        return result.recordset[0];
    },


    // ========================================
    // UPDATE
    // ========================================

    async update(
        id: number,
        name: string,
        capacity: number,
        totalRooms: number,
        basePrice: number,
        description?: string
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('name', sql.NVarChar(100), name)
            .input('capacity', sql.Int, capacity)
            .input('total_rooms', sql.Int, totalRooms)
            .input('base_price', sql.Decimal(12, 2), basePrice)
            .input(
                'description',
                sql.NVarChar(sql.MAX),
                description || null
            )
            .query(`
                UPDATE room_types
                SET
                    name = @name,
                    capacity = @capacity,
                    total_rooms = @total_rooms,
                    base_price = @base_price,
                    description = @description
                OUTPUT
                    INSERTED.id,
                    INSERTED.hotel_id,
                    INSERTED.name,
                    INSERTED.capacity,
                    INSERTED.total_rooms,
                    INSERTED.base_price,
                    INSERTED.description
                WHERE id = @id
            `);

        return result.recordset[0];
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(id: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                DELETE FROM room_types
                WHERE id = @id
            `);

        return result.rowsAffected[0];
    }
};