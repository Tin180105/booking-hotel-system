import { RoomTypeImageModel } from './roomTypeImage.model';
import { RoomTypeModel } from '../roomTypes/roomType.model';

export const RoomTypeImageService = {

    // ========================================
    // GET ALL
    // ========================================

    async getAll() {

        return await RoomTypeImageModel.getAll();
    },


    // ========================================
    // GET BY ROOM TYPE
    // ========================================

    async getByRoomTypeId(roomTypeId: number) {

        if (
            !Number.isInteger(roomTypeId) ||
            roomTypeId <= 0
        ) {
            throw new Error(
                'Room Type ID không hợp lệ'
            );
        }

        const roomType =
            await RoomTypeModel.getById(roomTypeId);

        if (!roomType) {
            throw new Error(
                'Không tìm thấy loại phòng'
            );
        }

        return await RoomTypeImageModel.getByRoomTypeId(
            roomTypeId
        );
    },


    // ========================================
    // GET BY ID
    // ========================================

    async getById(id: number) {

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(
                'Room Type Image ID không hợp lệ'
            );
        }

        const image =
            await RoomTypeImageModel.getById(id);

        if (!image) {
            throw new Error(
                'Không tìm thấy hình ảnh'
            );
        }

        return image;
    },


    // ========================================
    // CREATE
    // ========================================

    async create(
        roomTypeId: number,
        imageUrl: string,
        isThumbnail: boolean
    ) {

        if (
            !Number.isInteger(roomTypeId) ||
            roomTypeId <= 0
        ) {
            throw new Error(
                'Room Type ID không hợp lệ'
            );
        }

        if (
            !imageUrl ||
            !imageUrl.trim()
        ) {
            throw new Error(
                'Image URL không được để trống'
            );
        }

        const roomType =
            await RoomTypeModel.getById(roomTypeId);

        if (!roomType) {
            throw new Error(
                'Không tìm thấy loại phòng'
            );
        }

        return await RoomTypeImageModel.create(
            roomTypeId,
            imageUrl.trim(),
            Boolean(isThumbnail)
        );
    },


    // ========================================
    // UPDATE
    // ========================================

    async update(
        id: number,
        imageUrl: string,
        isThumbnail: boolean
    ) {

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(
                'Room Type Image ID không hợp lệ'
            );
        }

        if (
            !imageUrl ||
            !imageUrl.trim()
        ) {
            throw new Error(
                'Image URL không được để trống'
            );
        }

        const image =
            await RoomTypeImageModel.getById(id);

        if (!image) {
            throw new Error(
                'Không tìm thấy hình ảnh'
            );
        }

        return await RoomTypeImageModel.update(
            id,
            imageUrl.trim(),
            Boolean(isThumbnail)
        );
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(id: number) {

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(
                'Room Type Image ID không hợp lệ'
            );
        }

        const image =
            await RoomTypeImageModel.getById(id);

        if (!image) {
            throw new Error(
                'Không tìm thấy hình ảnh'
            );
        }

        await RoomTypeImageModel.delete(id);
    }
};