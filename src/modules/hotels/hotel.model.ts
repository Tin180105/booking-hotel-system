import { getConnection } from "../../config/database";

export interface CreateHotelRequest {
    name: string;
    city: string;
    address: string;
    phone?: string;
    description?: string;
    commissionRate?: number;
    starRating?: number;
    status?: string;
}

export interface UpdateHotelRequest {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    description?: string;
    commissionRate?: number;
    starRating?: number;
    status?: string;
}

export interface Hotel {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string | null;
    description: string | null;
    commissionRate: number;
    starRating: number;
    status: string;
    createdAt: Date;
}

export interface HotelOverview {
    hotelId: number;
    hotelName: string;
    city: string;
    address: string;
    phone: string | null;
    starRating: number;
    status: string;
    commissionRate: number;
    totalRoomTypes: number;
    totalAmenities: number;
}

export interface HotelRevenue {
    hotelId: number;
    hotelName: string;
    city: string;
    totalBookings: number;
    totalRevenue: number;
}

export const HotelModel = {
    async getOverview(): Promise<HotelOverview[]> {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                hotel_id,
                hotel_name,
                city,
                address,
                phone,
                star_rating,
                status,
                commission_rate,
                total_room_types,
                total_amenities
            FROM vw_HotelOverview
            ORDER BY hotel_id DESC
        `);

        return result.recordset.map((hotel: Record<string, any>) => ({
            hotelId: hotel.hotel_id,
            hotelName: hotel.hotel_name,
            city: hotel.city,
            address: hotel.address,
            phone: hotel.phone,
            starRating: hotel.star_rating,
            status: hotel.status,
            commissionRate: hotel.commission_rate,
            totalRoomTypes: hotel.total_room_types,
            totalAmenities: hotel.total_amenities,
        }));
    },

    async getRevenue(): Promise<HotelRevenue[]> {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                hotel_id,
                hotel_name,
                city,
                total_bookings,
                total_revenue
            FROM vw_HotelRevenue
            ORDER BY total_revenue DESC
        `);

        return result.recordset.map((hotel: Record<string, any>) => ({
            hotelId: hotel.hotel_id,
            hotelName: hotel.hotel_name,
            city: hotel.city,
            totalBookings: hotel.total_bookings,
            totalRevenue: hotel.total_revenue,
        }));
    },
};