import { RoomTypeModel } from './roomType.model';

export const RoomTypeService = {

    // ========================================
    // GET OVERVIEW
    // ========================================

    async getOverview() {

        return await RoomTypeModel.getOverview();
    },

    // ========================================
    // GET ALL
    // ========================================

    async getAll() {

        return await RoomTypeModel.getAll();
    },


    // ========================================
    // GET BY HOTEL
    // ========================================

    async getByHotelId(hotelId: number) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error('Hotel ID không hợp lệ');
        }

        return await RoomTypeModel.getByHotelId(
            hotelId
        );
    },


    // ========================================
    // GET BY ID
    // ========================================

    async getById(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Room Type ID không hợp lệ');
        }

        const roomType =
            await RoomTypeModel.getById(id);

        if (!roomType) {
            throw new Error(
                'Không tìm thấy loại phòng'
            );
        }

        return roomType;
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

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error('Hotel ID không hợp lệ');
        }

        if (!name || !name.trim()) {
            throw new Error(
                'Tên loại phòng không được để trống'
            );
        }

        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new Error(
                'Sức chứa phải lớn hơn 0'
            );
        }

        if (
            !Number.isInteger(totalRooms) ||
            totalRooms <= 0
        ) {
            throw new Error(
                'Số lượng phòng phải lớn hơn 0'
            );
        }

        if (
            typeof basePrice !== 'number' ||
            basePrice < 0
        ) {
            throw new Error(
                'Giá phòng không hợp lệ'
            );
        }

        return await RoomTypeModel.create(
            hotelId,
            name.trim(),
            capacity,
            totalRooms,
            basePrice,
            description
        );
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

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(
                'Room Type ID không hợp lệ'
            );
        }

        if (!name || !name.trim()) {
            throw new Error(
                'Tên loại phòng không được để trống'
            );
        }

        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new Error(
                'Sức chứa phải lớn hơn 0'
            );
        }

        if (
            !Number.isInteger(totalRooms) ||
            totalRooms <= 0
        ) {
            throw new Error(
                'Số lượng phòng phải lớn hơn 0'
            );
        }

        if (
            typeof basePrice !== 'number' ||
            basePrice < 0
        ) {
            throw new Error(
                'Giá phòng không hợp lệ'
            );
        }

        const roomType =
            await RoomTypeModel.getById(id);

        if (!roomType) {
            throw new Error(
                'Không tìm thấy loại phòng'
            );
        }

        return await RoomTypeModel.update(
            id,
            name.trim(),
            capacity,
            totalRooms,
            basePrice,
            description
        );
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(
                'Room Type ID không hợp lệ'
            );
        }

        const roomType =
            await RoomTypeModel.getById(id);

        if (!roomType) {
            throw new Error(
                'Không tìm thấy loại phòng'
            );
        }

        await RoomTypeModel.delete(id);
    }
};