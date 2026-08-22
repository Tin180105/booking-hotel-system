import { AmenityModel } from "./amenity.model";

export const AmenityService = {

    // GET ALL
    async getAll() {
        return await AmenityModel.getAll();
    },

    // GET BY ID
    async getById(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID tiện nghi không hợp lệ");
        }

        const amenity = await AmenityModel.getById(id);

        if (!amenity) {
            throw new Error("Không tìm thấy tiện nghi");
        }

        return amenity;
    },

    // CREATE
    async create(
        name: string,
        iconCode?: string
    ) {

        if (!name || name.trim() === "") {
            throw new Error("Tên tiện nghi không được để trống");
        }

        const trimmedName = name.trim();

        if (trimmedName.length > 100) {
            throw new Error(
                "Tên tiện nghi không được vượt quá 100 ký tự"
            );
        }

        return await AmenityModel.create(
            trimmedName,
            iconCode?.trim() || null
        );
    },

    // UPDATE
    async update(
        id: number,
        name: string,
        iconCode?: string
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID tiện nghi không hợp lệ");
        }

        if (!name || name.trim() === "") {
            throw new Error("Tên tiện nghi không được để trống");
        }

        const existing = await AmenityModel.getById(id);

        if (!existing) {
            throw new Error("Không tìm thấy tiện nghi");
        }

        const trimmedName = name.trim();

        if (trimmedName.length > 100) {
            throw new Error(
                "Tên tiện nghi không được vượt quá 100 ký tự"
            );
        }

        return await AmenityModel.update(
            id,
            trimmedName,
            iconCode?.trim() || null
        );
    },

    // DELETE
    async delete(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID tiện nghi không hợp lệ");
        }

        const existing = await AmenityModel.getById(id);

        if (!existing) {
            throw new Error("Không tìm thấy tiện nghi");
        }

        await AmenityModel.delete(id);
    }
};