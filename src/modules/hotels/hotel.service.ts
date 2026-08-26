import { getDB } from "../../config/database";

import {
    CreateHotelRequest,
    UpdateHotelRequest,
    HotelOverview,
    HotelRevenue
} from "./hotel.model";

import { HotelModel } from "./hotel.model";

// ========================================
// CREATE HOTEL
// ========================================

export const createHotel = async (
    data: CreateHotelRequest
) => {

    const db = await getDB();

    // ========================================
    // VALIDATE STAR RATING
    // ========================================

    if (
        data.starRating !== undefined &&
        (data.starRating < 1 ||
            data.starRating > 5)
    ) {
        throw new Error(
            "Star rating phải từ 1 đến 5"
        );
    }

    // ========================================
    // VALIDATE COMMISSION
    // ========================================

    if (
        data.commissionRate !== undefined &&
        (data.commissionRate < 0 ||
            data.commissionRate > 100)
    ) {
        throw new Error(
            "Commission rate phải từ 0 đến 100"
        );
    }

    // ========================================
    // INSERT HOTEL
    // ========================================

    const result = await db
        .request()
        .input("name", data.name)
        .input("city", data.city)
        .input("address", data.address)
        .input(
            "phone",
            data.phone ?? null
        )
        .input(
            "description",
            data.description ?? null
        )
        .input(
            "commissionRate",
            data.commissionRate ?? 15
        )
        .input(
            "starRating",
            data.starRating ?? 3
        )
        .input(
            "status",
            data.status ?? "PENDING_APPROVAL"
        )
        .query(`
            INSERT INTO hotels
            (
                name,
                city,
                address,
                phone,
                description,
                commission_rate,
                star_rating,
                status
            )
            OUTPUT
                INSERTED.id,
                INSERTED.name,
                INSERTED.city,
                INSERTED.address,
                INSERTED.phone,
                INSERTED.description,
                INSERTED.commission_rate,
                INSERTED.star_rating,
                INSERTED.status,
                INSERTED.created_at

            VALUES
            (
                @name,
                @city,
                @address,
                @phone,
                @description,
                @commissionRate,
                @starRating,
                @status
            )
        `);

    const hotel = result.recordset[0];

    return {
        id: hotel.id,
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        phone: hotel.phone,
        description: hotel.description,
        commissionRate:
            hotel.commission_rate,
        starRating:
            hotel.star_rating,
        status: hotel.status,
        createdAt:
            hotel.created_at,
    };
};


// ========================================
// GET ALL HOTELS
// ========================================

export const getHotels = async () => {

    const db = await getDB();

    const result = await db
        .request()
        .query(`
            SELECT
                id,
                name,
                city,
                address,
                phone,
                description,
                commission_rate,
                star_rating,
                status,
                created_at

            FROM hotels

            ORDER BY created_at DESC
        `);

    return result.recordset.map(
        (hotel) => ({
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            address: hotel.address,
            phone: hotel.phone,
            description:
                hotel.description,
            commissionRate:
                hotel.commission_rate,
            starRating:
                hotel.star_rating,
            status: hotel.status,
            createdAt:
                hotel.created_at,
        })
    );
};


// ========================================
// GET HOTEL BY ID
// ========================================

export const getHotelById = async (
    id: number
) => {

    const db = await getDB();

    const result = await db
        .request()
        .input("id", id)
        .query(`
            SELECT
                id,
                name,
                city,
                address,
                phone,
                description,
                commission_rate,
                star_rating,
                status,
                created_at

            FROM hotels

            WHERE id = @id
        `);

    if (
        result.recordset.length === 0
    ) {
        throw new Error(
            "Hotel không tồn tại"
        );
    }

    const hotel = result.recordset[0];

    return {
        id: hotel.id,
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        phone: hotel.phone,
        description:
            hotel.description,
        commissionRate:
            hotel.commission_rate,
        starRating:
            hotel.star_rating,
        status: hotel.status,
        createdAt:
            hotel.created_at,
    };
};


// ========================================
// UPDATE HOTEL
// ========================================

export const updateHotel = async (
    id: number,
    data: UpdateHotelRequest
) => {

    const db = await getDB();

    // ========================================
    // CHECK HOTEL
    // ========================================

    const check = await db
        .request()
        .input("id", id)
        .query(`
            SELECT id
            FROM hotels
            WHERE id = @id
        `);

    if (
        check.recordset.length === 0
    ) {
        throw new Error(
            "Hotel không tồn tại"
        );
    }

    // ========================================
    // VALIDATE
    // ========================================

    if (
        data.starRating !== undefined &&
        (data.starRating < 1 ||
            data.starRating > 5)
    ) {
        throw new Error(
            "Star rating phải từ 1 đến 5"
        );
    }

    if (
        data.commissionRate !== undefined &&
        (data.commissionRate < 0 ||
            data.commissionRate > 100)
    ) {
        throw new Error(
            "Commission rate phải từ 0 đến 100"
        );
    }

    // ========================================
    // UPDATE
    // ========================================

    await db
        .request()
        .input("id", id)
        .input(
            "name",
            data.name ?? null
        )
        .input(
            "city",
            data.city ?? null
        )
        .input(
            "address",
            data.address ?? null
        )
        .input(
            "phone",
            data.phone ?? null
        )
        .input(
            "description",
            data.description ?? null
        )
        .input(
            "commissionRate",
            data.commissionRate ?? null
        )
        .input(
            "starRating",
            data.starRating ?? null
        )
        .input(
            "status",
            data.status ?? null
        )
        .query(`
            UPDATE hotels
            SET
                name =
                    COALESCE(
                        @name,
                        name
                    ),

                city =
                    COALESCE(
                        @city,
                        city
                    ),

                address =
                    COALESCE(
                        @address,
                        address
                    ),

                phone =
                    COALESCE(
                        @phone,
                        phone
                    ),

                description =
                    COALESCE(
                        @description,
                        description
                    ),

                commission_rate =
                    COALESCE(
                        @commissionRate,
                        commission_rate
                    ),

                star_rating =
                    COALESCE(
                        @starRating,
                        star_rating
                    ),

                status =
                    COALESCE(
                        @status,
                        status
                    )

            WHERE id = @id
        `);

    return await getHotelById(id);
};


// ========================================
// DELETE HOTEL
// ========================================

export const deleteHotel = async (
    id: number
) => {

    const db = await getDB();

    const result = await db
        .request()
        .input("id", id)
        .query(`
            DELETE FROM hotels
            WHERE id = @id
        `);

    if (
        result.rowsAffected[0] === 0
    ) {
        throw new Error(
            "Hotel không tồn tại"
        );
    }

    return {
        message:
            "Xóa hotel thành công",
    };
};


// ========================================
// UPDATE HOTEL STATUS
// ========================================

export const updateHotelStatus = async (
    id: number,
    status: string
) => {

    const db = await getDB();

    const allowedStatus = [
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "ACTIVE",
        "INACTIVE",
    ];

    if (
        !allowedStatus.includes(status)
    ) {
        throw new Error(
            "Status không hợp lệ"
        );
    }

    const result = await db
        .request()
        .input("id", id)
        .input("status", status)
        .query(`
            UPDATE hotels

            SET status = @status

            WHERE id = @id
        `);

    if (
        result.rowsAffected[0] === 0
    ) {
        throw new Error(
            "Hotel không tồn tại"
        );
    }

    return await getHotelById(id);
};

export const getHotelOverview = async (): Promise<HotelOverview[]> => {

    return await HotelModel.getOverview();

};

// ========================================
// GET HOTEL REVENUE - VIEW
// ========================================

export const getHotelRevenue = async (): Promise<HotelRevenue[]> => {

    return await HotelModel.getRevenue();

};