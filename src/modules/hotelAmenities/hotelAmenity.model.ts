import sql from "mssql";
import { getConnection } from "../../config/database";

export const HotelAmenityModel = {

    // Lấy tất cả tiện nghi của một hotel
    async getByHotelId(hotelId: number) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("hotel_id", sql.BigInt, hotelId)
            .query(`
                SELECT
                    hotel_id,
                    amenity_id
                FROM hotel_amenities
                WHERE hotel_id = @hotel_id
                ORDER BY amenity_id
            `);

        return result.recordset;
    },


    // Kiểm tra hotel_amenity đã tồn tại chưa
    async exists(
        hotelId: number,
        amenityId: number
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("hotel_id", sql.BigInt, hotelId)
            .input("amenity_id", sql.BigInt, amenityId)
            .query(`
                SELECT 1
                FROM hotel_amenities
                WHERE hotel_id = @hotel_id
                AND amenity_id = @amenity_id
            `);

        return result.recordset.length > 0;
    },


    // Thêm amenity vào hotel
    async create(
        hotelId: number,
        amenityId: number
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("hotel_id", sql.BigInt, hotelId)
            .input("amenity_id", sql.BigInt, amenityId)
            .query(`
                INSERT INTO hotel_amenities
                (
                    hotel_id,
                    amenity_id
                )
                OUTPUT
                    INSERTED.hotel_id,
                    INSERTED.amenity_id
                VALUES
                (
                    @hotel_id,
                    @amenity_id
                )
            `);

        return result.recordset[0];
    },


    // Xóa amenity khỏi hotel
    async delete(
        hotelId: number,
        amenityId: number
    ) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("hotel_id", sql.BigInt, hotelId)
            .input("amenity_id", sql.BigInt, amenityId)
            .query(`
                DELETE FROM hotel_amenities
                WHERE hotel_id = @hotel_id
                AND amenity_id = @amenity_id
            `);

        return result.rowsAffected[0];
    }
};