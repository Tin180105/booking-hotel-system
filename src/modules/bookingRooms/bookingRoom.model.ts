import sql from 'mssql';
import { getConnection } from '../../config/database';

export interface BookingRoom {
    id: number;
    booking_id: number;
    room_type_id: number;
    quantity: number;
    total_room_price: number;
    expected_check_in: Date;
    expected_check_out: Date;
}

export interface CreateBookingRoomDTO {
    booking_id: number;
    room_type_id: number;
    quantity?: number;
    total_room_price: number;
    expected_check_in: Date | string;
    expected_check_out: Date | string;
}

export interface UpdateBookingRoomDTO {
    booking_id: number;
    room_type_id: number;
    quantity: number;
    total_room_price: number;
    expected_check_in: Date | string;
    expected_check_out: Date | string;
}

export class BookingRoomModel {

    // =========================
    // GET ALL
    // =========================
    static async getAll(): Promise<BookingRoom[]> {

        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                id,
                booking_id,
                room_type_id,
                quantity,
                total_room_price,
                expected_check_in,
                expected_check_out
            FROM booking_rooms
            ORDER BY id DESC
        `);

        return result.recordset;
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(
        id: number
    ): Promise<BookingRoom | null> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .query(`
                SELECT
                    id,
                    booking_id,
                    room_type_id,
                    quantity,
                    total_room_price,
                    expected_check_in,
                    expected_check_out
                FROM booking_rooms
                WHERE id = @id
            `);

        return result.recordset.length > 0
            ? result.recordset[0]
            : null;
    }

    // =========================
    // GET BY BOOKING ID
    // =========================
    static async getByBookingId(
        bookingId: number
    ): Promise<BookingRoom[]> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('booking_id', sql.BigInt, bookingId)
            .query(`
                SELECT
                    id,
                    booking_id,
                    room_type_id,
                    quantity,
                    total_room_price,
                    expected_check_in,
                    expected_check_out
                FROM booking_rooms
                WHERE booking_id = @booking_id
                ORDER BY id ASC
            `);

        return result.recordset;
    }

    // =========================
    // CREATE
    // =========================
    static async create(
        data: CreateBookingRoomDTO
    ): Promise<BookingRoom> {

        const pool = await getConnection();

        const result = await pool.request()
            .input(
                'booking_id',
                sql.BigInt,
                data.booking_id
            )
            .input(
                'room_type_id',
                sql.BigInt,
                data.room_type_id
            )
            .input(
                'quantity',
                sql.Int,
                data.quantity ?? 1
            )
            .input(
                'total_room_price',
                sql.Decimal(12, 2),
                data.total_room_price
            )
            .input(
                'expected_check_in',
                sql.DateTime2,
                data.expected_check_in
            )
            .input(
                'expected_check_out',
                sql.DateTime2,
                data.expected_check_out
            )
            .query(`
                INSERT INTO booking_rooms (
                    booking_id,
                    room_type_id,
                    quantity,
                    total_room_price,
                    expected_check_in,
                    expected_check_out
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.booking_id,
                    INSERTED.room_type_id,
                    INSERTED.quantity,
                    INSERTED.total_room_price,
                    INSERTED.expected_check_in,
                    INSERTED.expected_check_out
                VALUES (
                    @booking_id,
                    @room_type_id,
                    @quantity,
                    @total_room_price,
                    @expected_check_in,
                    @expected_check_out
                )
            `);

        return result.recordset[0];
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        id: number,
        data: UpdateBookingRoomDTO
    ): Promise<BookingRoom | null> {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input(
                'booking_id',
                sql.BigInt,
                data.booking_id
            )
            .input(
                'room_type_id',
                sql.BigInt,
                data.room_type_id
            )
            .input(
                'quantity',
                sql.Int,
                data.quantity
            )
            .input(
                'total_room_price',
                sql.Decimal(12, 2),
                data.total_room_price
            )
            .input(
                'expected_check_in',
                sql.DateTime2,
                data.expected_check_in
            )
            .input(
                'expected_check_out',
                sql.DateTime2,
                data.expected_check_out
            )
            .query(`
                UPDATE booking_rooms
                SET
                    booking_id = @booking_id,
                    room_type_id = @room_type_id,
                    quantity = @quantity,
                    total_room_price = @total_room_price,
                    expected_check_in = @expected_check_in,
                    expected_check_out = @expected_check_out
                OUTPUT
                    INSERTED.id,
                    INSERTED.booking_id,
                    INSERTED.room_type_id,
                    INSERTED.quantity,
                    INSERTED.total_room_price,
                    INSERTED.expected_check_in,
                    INSERTED.expected_check_out
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
                DELETE FROM booking_rooms
                WHERE id = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    // =========================
    // CALCULATE STAY DAYS
    // =========================
    static async calculateStayDays(
        checkIn: Date,
        checkOut: Date
    ): Promise<number> {

        const pool = await getConnection();

        const result = await pool.request()
            .input(
                'check_in',
                sql.DateTime2,
                checkIn
            )
            .input(
                'check_out',
                sql.DateTime2,
                checkOut
            )
            .query(`
                SELECT dbo.fn_CalculateStayDays(
                    @check_in,
                    @check_out
                ) AS stay_days
            `);

        return result.recordset[0].stay_days;
    }

        // =========================
    // CALCULATE ROOM PRICE
    // =========================
    static async calculateRoomPrice(
        roomTypeId: number,
        checkIn: Date,
        checkOut: Date,
        quantity: number
    ): Promise<number> {

        const pool = await getConnection();

        const result = await pool.request()
            .input(
                'room_type_id',
                sql.BigInt,
                roomTypeId
            )
            .input(
                'check_in',
                sql.DateTime2,
                checkIn
            )
            .input(
                'check_out',
                sql.DateTime2,
                checkOut
            )
            .input(
                'quantity',
                sql.Int,
                quantity
            )
            .query(`
                SELECT dbo.fn_CalculateRoomPrice(
                    @room_type_id,
                    @check_in,
                    @check_out,
                    @quantity
                ) AS total_room_price
            `);

        return result.recordset[0].total_room_price;
    }
}