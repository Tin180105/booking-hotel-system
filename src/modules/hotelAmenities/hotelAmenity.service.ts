import { HotelAmenityModel } from "./hotelAmenity.model";

export const HotelAmenityService = {

    // Lấy danh sách amenity của hotel
    async getByHotelId(hotelId: number) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error("Hotel ID không hợp lệ");
        }

        return await HotelAmenityModel.getByHotelId(
            hotelId
        );
    },


    // Thêm amenity cho hotel
    async create(
        hotelId: number,
        amenityId: number
    ) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error("Hotel ID không hợp lệ");
        }

        if (!Number.isInteger(amenityId) || amenityId <= 0) {
            throw new Error("Amenity ID không hợp lệ");
        }


        // Kiểm tra đã tồn tại chưa
        const exists =
            await HotelAmenityModel.exists(
                hotelId,
                amenityId
            );

        if (exists) {
            throw new Error(
                "Amenity đã được thêm vào hotel"
            );
        }


        return await HotelAmenityModel.create(
            hotelId,
            amenityId
        );
    },


    // Xóa amenity khỏi hotel
    async delete(
        hotelId: number,
        amenityId: number
    ) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error("Hotel ID không hợp lệ");
        }

        if (!Number.isInteger(amenityId) || amenityId <= 0) {
            throw new Error("Amenity ID không hợp lệ");
        }


        const exists =
            await HotelAmenityModel.exists(
                hotelId,
                amenityId
            );

        if (!exists) {
            throw new Error(
                "Amenity chưa được thêm vào hotel"
            );
        }


        await HotelAmenityModel.delete(
            hotelId,
            amenityId
        );
    }
};